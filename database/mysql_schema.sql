-- Esquema MySQL para la plataforma SESI
-- Ejecuta este script en MySQL 8+ para crear la base y poblarla con datos de ejemplo.

CREATE DATABASE IF NOT EXISTS sesi_plataforma
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE sesi_plataforma;

-- Tabla de docentes (accesos y perfil)
CREATE TABLE IF NOT EXISTS docentes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  detalle VARCHAR(200) DEFAULT NULL,
  iniciales VARCHAR(10) DEFAULT NULL,
  telefono VARCHAR(30) DEFAULT NULL,
  estado ENUM('activo', 'suspendido') NOT NULL DEFAULT 'activo',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de estudiantes (accesos y datos académicos)
CREATE TABLE IF NOT EXISTS estudiantes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  grado VARCHAR(50) DEFAULT NULL,
  seccion VARCHAR(50) DEFAULT NULL,
  detalle VARCHAR(200) DEFAULT NULL,
  apoderado VARCHAR(150) DEFAULT NULL,
  telefono_apoderado VARCHAR(30) DEFAULT NULL,
  estado ENUM('regular', 'pendiente', 'retirado') NOT NULL DEFAULT 'regular',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Cursos base (se limitan a las 4 áreas solicitadas)
CREATE TABLE IF NOT EXISTS cursos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(120) NOT NULL,
  nivel VARCHAR(50) DEFAULT NULL,
  seccion VARCHAR(50) DEFAULT NULL,
  turno VARCHAR(30) DEFAULT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Relación docente-curso (qué docente dicta cada curso/sección)
CREATE TABLE IF NOT EXISTS docente_curso (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  docente_id BIGINT UNSIGNED NOT NULL,
  curso_id BIGINT UNSIGNED NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_docente_curso (docente_id, curso_id),
  CONSTRAINT fk_docente_curso_docente FOREIGN KEY (docente_id) REFERENCES docentes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_docente_curso_curso FOREIGN KEY (curso_id) REFERENCES cursos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tareas enviadas por docentes
CREATE TABLE IF NOT EXISTS tareas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  docente_id BIGINT UNSIGNED NOT NULL,
  curso_id BIGINT UNSIGNED NOT NULL,
  titulo VARCHAR(180) NOT NULL,
  detalle TEXT,
  fecha_entrega DATE DEFAULT NULL,
  estado ENUM('pendiente', 'publicada', 'cerrada') NOT NULL DEFAULT 'publicada',
  creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tareas_curso (curso_id, fecha_entrega),
  CONSTRAINT fk_tareas_docente FOREIGN KEY (docente_id) REFERENCES docentes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_tareas_curso FOREIGN KEY (curso_id) REFERENCES cursos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Seguimiento de tareas por estudiante (estado de recepción/entrega)
CREATE TABLE IF NOT EXISTS tareas_estudiantes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tarea_id BIGINT UNSIGNED NOT NULL,
  estudiante_id BIGINT UNSIGNED NOT NULL,
  estado ENUM('pendiente', 'entregada', 'revisada', 'vencida') NOT NULL DEFAULT 'pendiente',
  comentario_docente TEXT,
  calificacion DECIMAL(4,2) DEFAULT NULL,
  entregada_en DATETIME DEFAULT NULL,
  UNIQUE KEY uniq_tarea_estudiante (tarea_id, estudiante_id),
  CONSTRAINT fk_te_tarea FOREIGN KEY (tarea_id) REFERENCES tareas(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_te_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Recursos compartidos (presentaciones o videos por curso)
CREATE TABLE IF NOT EXISTS recursos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  docente_id BIGINT UNSIGNED NOT NULL,
  curso_id BIGINT UNSIGNED NOT NULL,
  titulo VARCHAR(180) NOT NULL,
  tipo ENUM('presentacion', 'video') NOT NULL,
  nombre_archivo VARCHAR(255) DEFAULT NULL,
  url_archivo TEXT,
  mime_type VARCHAR(150) DEFAULT NULL,
  tamano_bytes BIGINT UNSIGNED DEFAULT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_recursos_docente FOREIGN KEY (docente_id) REFERENCES docentes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_recursos_curso FOREIGN KEY (curso_id) REFERENCES cursos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Registro de descargas/visualizaciones de recursos (auditoría opcional)
CREATE TABLE IF NOT EXISTS recursos_eventos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  recurso_id BIGINT UNSIGNED NOT NULL,
  estudiante_id BIGINT UNSIGNED DEFAULT NULL,
  evento ENUM('descarga', 'reproduccion') NOT NULL,
  detalle VARCHAR(255) DEFAULT NULL,
  ocurrido_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_re_evento_recurso FOREIGN KEY (recurso_id) REFERENCES recursos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_re_evento_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Datos de ejemplo alineados con las credenciales demo usadas en la UI
INSERT INTO docentes (email, password_hash, nombre, detalle, iniciales)
VALUES
  ('clasico3040@gmail.com', SHA2('docente123', 256), 'María Elena Rojas', 'Docente de Comunicación', 'MR'),
  ('jcarranza@ie3058.edu.pe', SHA2('horario456', 256), 'Javier Carranza', 'Docente de Matemática', 'JC')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  detalle = VALUES(detalle),
  iniciales = VALUES(iniciales);

INSERT INTO estudiantes (email, password_hash, nombre, grado, seccion, detalle)
VALUES
  ('karter1314@gmail.com', SHA2('alumno123', 256), 'Lucía Herrera', '4.º Secundaria', 'B', 'Estudiante 4.º de secundaria'),
  ('mmendoza@ie3058.edu.pe', SHA2('alumno456', 256), 'Miguel Mendoza', '3.º Secundaria', 'A', 'Estudiante 3.º de secundaria')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  grado = VALUES(grado),
  seccion = VALUES(seccion),
  detalle = VALUES(detalle);

INSERT INTO cursos (codigo, nombre, nivel, seccion, turno)
VALUES
  ('PS-2G', 'Personal Social', '2.º Grado', 'A', 'Mañana'),
  ('COM-2G', 'Comunicación', '2.º Grado', 'A', 'Mañana'),
  ('ART-2G', 'Arte y Cultura', '2.º Grado', 'A', 'Mañana'),
  ('ING-2G', 'Inglés', '2.º Grado', 'A', 'Mañana'),
  ('CYT-2G', 'Ciencia y Tecnología', '2.º Grado', 'A', 'Mañana'),
  ('EPT-2G', 'Educación para el Trabajo', '2.º Grado', 'A', 'Mañana')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  nivel = VALUES(nivel),
  seccion = VALUES(seccion),
  turno = VALUES(turno);

-- Asociar docentes con sus cursos base
INSERT INTO docente_curso (docente_id, curso_id)
SELECT d.id, c.id
FROM docentes d
JOIN cursos c ON (
  (d.email = 'clasico3040@gmail.com' AND c.codigo IN ('PS-2G', 'COM-2G', 'ART-2G'))
  OR (d.email = 'jcarranza@ie3058.edu.pe' AND c.codigo IN ('CYT-2G', 'ING-2G', 'EPT-2G'))
)
ON DUPLICATE KEY UPDATE docente_id = docente_id;

-- Tareas iniciales
  INSERT INTO tareas (docente_id, curso_id, titulo, detalle, fecha_entrega)
  SELECT d.id, c.id, 'Lectura y resumen', 'Leer el capítulo 3 y preparar un resumen de una página.', DATE_ADD(CURDATE(), INTERVAL 7 DAY)
  FROM docentes d JOIN cursos c ON d.email = 'clasico3040@gmail.com' AND c.codigo = 'COM-2G'
  UNION ALL
  SELECT d.id, c.id, 'Práctica de ejercicios', 'Resolver la guía de ecuaciones cuadráticas.', DATE_ADD(CURDATE(), INTERVAL 5 DAY)
  FROM docentes d JOIN cursos c ON d.email = 'jcarranza@ie3058.edu.pe' AND c.codigo = 'CYT-2G'
  ON DUPLICATE KEY UPDATE titulo = VALUES(titulo);

  -- Recursos iniciales
  INSERT INTO recursos (docente_id, curso_id, titulo, tipo, nombre_archivo, url_archivo, mime_type)
  SELECT d.id, c.id, 'Presentación de la semana', 'presentacion', 'semana-uno.pdf', 'https://example.com/semana-uno.pdf', 'application/pdf'
  FROM docentes d JOIN cursos c ON d.email = 'clasico3040@gmail.com' AND c.codigo = 'COM-2G'
  UNION ALL
  SELECT d.id, c.id, 'Video de laboratorio', 'video', 'experimento.mp4', 'https://example.com/experimento.mp4', 'video/mp4'
  FROM docentes d JOIN cursos c ON d.email = 'jcarranza@ie3058.edu.pe' AND c.codigo = 'CYT-2G'
  ON DUPLICATE KEY UPDATE titulo = VALUES(titulo);
