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
- **Plantillas de muestra** con docentes y estudiantes preconfigurados para que puedas probar el flujo de aula desde el primer uso.
- **Estado vivo y persistente**: las tareas enviadas y los recursos compartidos se guardan en el navegador (localStorage) para que permanezcan disponibles tras recargar o volver a abrir la plataforma.
- **Diseño responsive** pensado para equipos directivos que utilizan tanto escritorio como tabletas.
- **Botones activos**: accesos rápidos (centro de ayuda, mesa de partes, tutoría y restablecimiento de contraseña) muestran confirmaciones inmediatas para que la interfaz no quede estática.

## Uso

1. Abre el archivo `index.html` en tu navegador favorito. La aplicación precarga un padrón base embebido desde el inicio para que el flujo funcione incluso sin servidor o antes de que se lean los JSON externos.
2. Elige el tipo de acceso (docente o estudiante) y presiona **Acceder**: los campos se rellenan con la cuenta de ejemplo para que el inicio no se quede estático.
   - Docente: `benjaaaaasss@gmail.com` · contraseña `docente123`
   - Estudiante: `karter1314@gmail.com` · contraseña `alumno123`
3. Según el perfil seleccionado se mostrará la interfaz dedicada:
- **Docentes**: ingresan al **Espacio docente**, donde pueden enviar tareas a sus cursos y compartir presentaciones o videos para apoyar cada sesión.
  - **Estudiantes**: visualizan el **Panel del estudiante**, con agenda personal, reproductor de videos compartidos y listado de tareas recibidas por sus docentes.

La bandeja de tareas y recursos se inicializa con ejemplos listos para editar o eliminar. Así, incluso en la primera carga todo se muestra activo y con botones funcionales sin necesidad de agregar contenido manualmente.

   Desde el panel de calificaciones, los estudiantes pueden descargar su boleta de notas en formato HTML (compatible para imprimir o guardar como PDF) con las competencias de Comunicación, Matemática, Ciencia y Tecnología y Educación Física según el bimestre seleccionado.

Las tareas y recursos compartidos que gestiones desde el rol docente se almacenan automáticamente en el navegador. Al recargar la página seguirán disponibles; si deseas limpiar el estado, borra la clave `sesiWorkspaceState` del almacenamiento local.

## Tecnologías

- HTML5 semántico
- CSS3 con variables y layout responsive
- JavaScript (ES6) para navegación y autenticación simulada

## Base de datos de accesos

- El padrón de cuentas se carga automáticamente desde dos archivos JSON (`data/docentes.json` y `data/estudiantes.json`), pensados para exportarse desde Excel/Sheets (guardar como CSV y convertir a JSON). El padrón embebido se aplica de inmediato para habilitar el acceso; si los archivos no están disponibles o el navegador bloquea su lectura, el flujo sigue operativo con ese padrón base.
- Cada registro puede incluir `email`, `password`, `name`, `detail` e `initials`. La aplicación normaliza los datos y utiliza los valores para personalizar los encabezados de cada rol.
- Para actualizar la base de accesos, edita `data/docentes.json` o `data/estudiantes.json` directamente (puedes exportar desde Excel como CSV y convertirlo a JSON).
- Si guardaste un padrón vacío o con errores, la app vuelve a aplicar el padrón embebido automáticamente al iniciar. Si quieres forzar el padrón original manualmente, elimina la clave `sesiDirectory` del almacenamiento local del navegador y recarga la página. También puedes limpiar las credenciales guardadas borrando `sesiCredentials`.
- Si abres el proyecto directamente como archivo (`file://`), algunos navegadores bloquean la lectura del JSON. La app ya incluye un padrón base embebido para mantener el login funcional, pero si quieres leer tus propios archivos JSON usa un servidor local ligero (por ejemplo, Live Server de VS Code o `python -m http.server`).

## Recuperación de contraseña con Gmail

La opción “¿Olvidaste tu contraseña?” ahora envía un enlace de restablecimiento real al correo institucional de la cuenta (por ejemplo, `benjaaaaasss@gmail.com`) usando Gmail como proveedor SMTP.

1. Instala dependencias y arranca el servidor API + estáticos:

   ```bash
   npm install
   GMAIL_USER="tu_cuenta@gmail.com" GMAIL_PASS="tu_contraseña_de_aplicación" npm start
   ```

   - Usa una **contraseña de aplicación** de Gmail (no la contraseña normal). Activa la verificación en 2 pasos en Gmail y genera la clave de 16 dígitos.
   - El servidor (`server.js`) expone `http://localhost:3000/api/auth/request-reset`, valida que el correo exista en `data/docentes.json` o `data/estudiantes.json` y envía el enlace. También sirve los archivos estáticos para evitar problemas de CORS.

2. Abre `http://localhost:3000` y solicita el enlace desde “¿Olvidaste tu contraseña?” en la pantalla de acceso. El mensaje llegará al Gmail configurado para la cuenta registrada.

3. Si quieres validar manualmente un token, puedes llamar a `POST /api/auth/validate-token` con `{ "token": "..." }`. Los tokens expiran en 20 minutos.

> Asegúrate de que las direcciones en `data/docentes.json` y `data/estudiantes.json` correspondan a correos reales; de lo contrario, Gmail rechazará el envío.

## Esquema MySQL sugerido

> El flujo sigue siendo simulado en frontend: si deseas una base real, puedes crear tus propias tablas en MySQL o cualquier motor similar siguiendo los campos de los JSON de padrones y los envíos de tareas/recursos.

## Próximos pasos sugeridos

- Integrar autenticación real y conexión con la base de datos institucional.
- Añadir gráficos dinámicos y filtros avanzados para reportes.
- Implementar persistencia de datos y servicios API para matrículas y calificaciones.
