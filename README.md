# SESI Plataforma Educativa

Una interfaz moderna para la plataforma SESI, con mejoras de diseño y experiencia de usuario. Esta versión incluye un flujo de autenticación simulado y espacios visuales dedicados para docentes y estudiantes, abarcando horarios, tareas, recursos compartidos y seguimiento académico.

## Características principales

- **Pantalla de acceso renovada** con diseño gradiente, tarjetas informativas y soporte para recordatorio de dispositivo.
- **Accesos diferenciados** que redirigen a espacios independientes para docentes y estudiantes, recordando las credenciales de cada perfil.
- **Espacio docente** dedicado al envío de tareas con instrucciones claras y un módulo para compartir presentaciones o videos de las clases, con opción de eliminar envíos si ya no son necesarios.
- **Panel del estudiante** orientado a la consulta de tareas, agenda personal, horario semanal y bandeja de recursos donde se visualizan presentaciones o videos compartidos por los docentes.
- **Calificaciones por competencias** sobre las cuatro áreas activas del curso (Comunicación, Matemática, Ciencia y Tecnología, Educación Física), con descarga rápida de la boleta en HTML para imprimirla como PDF.
- **Estado de boleta inconcluso**: el selector muestra los 4 bimestres; cada uno trae combinaciones variadas de niveles (AD, A, B y C) para que los avances no se vean idénticos y el ciclo siga en progreso.
- **Texto legible en negro** en todos los módulos (acceso, panel docente y panel estudiante) para garantizar contraste y lectura clara sobre fondos claros.
- **Estado vivo y persistente**: las tareas enviadas y los recursos compartidos se guardan en el navegador (localStorage) para que permanezcan disponibles tras recargar o volver a abrir la plataforma.
- **Diseño responsive** pensado para equipos directivos que utilizan tanto escritorio como tabletas.
- **Botones activos**: accesos rápidos (centro de ayuda, mesa de partes y restablecimiento de contraseña) muestran confirmaciones inmediatas para que la interfaz no quede estática.

## Uso

1. Abre el archivo `index.html` en tu navegador favorito. El acceso funciona sin archivos externos ni base de datos.
2. Elige el tipo de acceso (docente o estudiante), escribe cualquier correo y contraseña y presiona **Acceder**: el flujo es completamente simulado.
3. Según el perfil seleccionado se mostrará la interfaz dedicada:
   - **Docentes**: ingresan al **Espacio docente**, donde pueden enviar tareas a sus cursos y compartir presentaciones o videos para apoyar cada sesión.
   - **Estudiantes**: visualizan el **Panel del estudiante**, con agenda personal, reproductor de videos compartidos y listado de tareas recibidas por sus docentes.

La bandeja de tareas y recursos se inicializa con ejemplos listos para editar o eliminar. Así, incluso en la primera carga todo se muestra activo y con botones funcionales sin necesidad de agregar contenido manualmente.

   Desde el panel de calificaciones, los estudiantes pueden descargar su boleta de notas en formato HTML (compatible para imprimir o guardar como PDF) con las competencias de Comunicación, Matemática, Ciencia y Tecnología y Educación Física según el bimestre seleccionado.

Las tareas y recursos compartidos que gestiones desde el rol docente se almacenan automáticamente en el navegador. Al recargar la página seguirán disponibles; si deseas limpiar el estado, borra la clave `sesiWorkspaceState` del almacenamiento local.

## Accesos sin base de datos

- No hay archivos `data/*.json` ni padrón de cuentas incluido. Puedes probar el inicio de sesión con cualquier correo y contraseña.
- El encabezado de cada rol se personaliza con el correo que ingreses y los datos quedan en el almacenamiento local (`sesiCredentials`) para recordar el último uso.
- Cuando tengas tu base real, podrás conectar los endpoints o archivos que prefieras sin necesidad de borrar nada del frontal.

## Tecnologías

- HTML5 semántico
- CSS3 con variables y layout responsive
- JavaScript (ES6) para navegación y autenticación simulada

## Personalización del acceso

- La autenticación es totalmente simulada en el frontend; no hay archivos JSON ni base de datos conectados.
- Las credenciales se almacenan en el navegador para recordar tu último ingreso (`sesiCredentials`).
- Cuando dispongas de tu backend o de tus propios servicios, podrás conectar las peticiones desde `script.js` o reemplazar el flujo de validación sin modificar el diseño.

## Recuperación de contraseña con Gmail

La opción “¿Olvidaste tu contraseña?” puede enviar un enlace de restablecimiento usando Gmail como proveedor SMTP. Si no configuras las credenciales, el flujo responde con un envío simulado para que la interfaz no se sienta estática.

1. Instala dependencias y arranca el servidor API + estáticos:

   ```bash
   npm install
   GMAIL_USER="tu_cuenta@gmail.com" GMAIL_PASS="tu_contraseña_de_aplicación" npm start
   ```

   - Usa una **contraseña de aplicación** de Gmail (no la contraseña normal). Activa la verificación en 2 pasos en Gmail y genera la clave de 16 dígitos.
   - El servidor (`server.js`) expone `http://localhost:3000/api/auth/request-reset` y envía el enlace al correo indicado. Si no hay credenciales de Gmail, devuelve un mensaje simulado para mantener el flujo operativo.

2. Abre `http://localhost:3000` y solicita el enlace desde “¿Olvidaste tu contraseña?” en la pantalla de acceso. El mensaje llegará al Gmail configurado para la cuenta registrada.

3. Si quieres validar manualmente un token, puedes llamar a `POST /api/auth/validate-token` con `{ "token": "..." }`. Los tokens expiran en 20 minutos.

## Próximos pasos sugeridos

- Integrar autenticación real y conexión con la base de datos institucional.
- Añadir gráficos dinámicos y filtros avanzados para reportes.
- Implementar persistencia de datos y servicios API para matrículas y calificaciones.
