const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DIRECTORY_FILES = {
  teacher: 'docentes.json',
  student: 'estudiantes.json'
};

const resetStore = new Map();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname)));

function readDirectory(role) {
  const file = DIRECTORY_FILES[role];
  if (!file) return [];

  const filePath = path.join(DATA_DIR, file);

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return Array.isArray(parsed[role]) ? parsed[role] : [];
  } catch (error) {
    console.warn(`No se pudo leer el padrón de ${role}:`, error.message);
    return [];
  }
}

function findAccount(role, email) {
  const directory = readDirectory(role);
  return directory.find((entry) => entry.email?.toLowerCase() === email?.toLowerCase());
}

function buildTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;

  if (!user || !pass) {
    throw new Error('Configura GMAIL_USER y GMAIL_PASS (contraseña de aplicación) para enviar correos.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });
}

function registerResetToken(email, role) {
  const token = crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + 20 * 60 * 1000; // 20 minutos
  resetStore.set(token, { email, role, expiresAt });
  return { token, expiresAt };
}

function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, meta] of resetStore.entries()) {
    if (meta.expiresAt <= now) {
      resetStore.delete(token);
    }
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, version: '1.0.0' });
});

app.post('/api/auth/request-reset', async (req, res) => {
  const { email, role } = req.body || {};

  if (!email || !role) {
    return res.status(400).json({ message: 'Faltan el correo y el rol para enviar el enlace de recuperación.' });
  }

  const normalizedRole = role === 'student' ? 'student' : 'teacher';
  const account = findAccount(normalizedRole, email);

  if (!account) {
    return res.status(404).json({ message: 'No encontramos una cuenta con ese correo institucional.' });
  }

  cleanupExpiredTokens();

  let transporter;
  try {
    transporter = buildTransporter();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const { token, expiresAt } = registerResetToken(email, normalizedRole);
  const resetLink = `${req.protocol}://${req.get('host')}/reset?token=${token}`;
  const subject = 'Recupera tu acceso SESI';
  const plainText = `Hola ${account.name || ''},\n\n` +
    'Recibimos una solicitud para restablecer tu contraseña en la plataforma SESI. ' +
    'Usa el siguiente enlace antes de 20 minutos:\n\n' +
    `${resetLink}\n\n` +
    'Si no solicitaste el cambio, ignora este mensaje.';

  const html = `<!doctype html><html><body>` +
    `<p>Hola <strong>${account.name || email}</strong>,</p>` +
    `<p>Usa este enlace para restablecer tu contraseña en SESI (vigente por 20 minutos):</p>` +
    `<p><a href="${resetLink}" target="_blank" rel="noopener">${resetLink}</a></p>` +
    `<p>Si no solicitaste el cambio, puedes ignorar este correo.</p>` +
    `</body></html>`;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject,
      text: plainText,
      html
    });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error.message);
    return res.status(502).json({ message: 'No se pudo enviar el correo. Verifica las credenciales de Gmail o usa una contraseña de aplicación.' });
  }

  res.json({
    message: 'Revisa tu bandeja. Te enviamos el enlace para restablecer tu contraseña.',
    token,
    expiresAt
  });
});

app.post('/api/auth/validate-token', (req, res) => {
  const { token } = req.body || {};
  cleanupExpiredTokens();

  if (!token || !resetStore.has(token)) {
    return res.status(404).json({ message: 'El enlace ya expiró o no es válido.' });
  }

  const meta = resetStore.get(token);
  return res.json({ ok: true, email: meta.email, role: meta.role, expiresAt: meta.expiresAt });
});

app.listen(PORT, () => {
  console.log(`Servidor SESI listo en http://localhost:${PORT}`);
});
