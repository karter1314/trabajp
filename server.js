const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

const resetStore = new Map();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

function buildTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;

  if (!user || !pass) return null;

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

  cleanupExpiredTokens();

  const transporter = buildTransporter();

  const { token, expiresAt } = registerResetToken(email, normalizedRole);
  const resetLink = `${req.protocol}://${req.get('host')}/reset?token=${token}`;
  const subject = 'Recupera tu acceso SESI';
  const plainText = `Hola ${email},\n\n` +
    'Recibimos una solicitud para restablecer tu contraseña en la plataforma SESI. ' +
    'Usa el siguiente enlace antes de 20 minutos:\n\n' +
    `${resetLink}\n\n` +
    'Si no solicitaste el cambio, ignora este mensaje.';

  const html = `<!doctype html><html><body>` +
    `<p>Hola <strong>${email}</strong>,</p>` +
    `<p>Usa este enlace para restablecer tu contraseña en SESI (vigente por 20 minutos):</p>` +
    `<p><a href="${resetLink}" target="_blank" rel="noopener">${resetLink}</a></p>` +
    `<p>Si no solicitaste el cambio, puedes ignorar este correo.</p>` +
    `</body></html>`;

  if (transporter) {
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
  } else {
    console.info('Envío simulado: configura GMAIL_USER y GMAIL_PASS para habilitar el correo real.');
  }

  res.json({
    message: transporter
      ? 'Revisa tu bandeja. Te enviamos el enlace para restablecer tu contraseña.'
      : 'Se generó un enlace de recuperación simulado. Configura Gmail para enviarlo de forma real.',
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
