# SESI Plataforma Educativa

Una interfaz moderna para la plataforma SESI, con mejoras de diseño y experiencia de usuario. Esta versión incluye un flujo de autenticación simulado y espacios visuales dedicados para docentes y estudiantes, abarcando horarios, tareas, recursos compartidos y seguimiento académico.

## Características principales

- **Pantalla de acceso renovada** con diseño gradiente, tarjetas informativas y soporte para recordatorio de dispositivo.
- **Accesos diferenciados** que redirigen a espacios independientes para docentes y estudiantes, recordando las credenciales de cada perfil.
- **Espacio docente** dedicado al envío de tareas con instrucciones claras y un módulo para compartir presentaciones o videos de las clases.
- **Panel del estudiante** orientado a la consulta de resultados, asistencias y agenda personal, con horario semanal, buzón de tareas y una bandeja de recursos donde se visualizan presentaciones o videos compartidos por los docentes.
- **Plantillas ampliadas** con 10 docentes y 20 estudiantes de muestra que enriquecen las tablas y permiten visualizar la gestión de aulas más completa.
- **Estado vivo y persistente**: las tareas enviadas y los recursos compartidos se guardan en el navegador (localStorage) para que permanezcan disponibles tras recargar o volver a abrir la plataforma.
- **Diseño responsive** pensado para equipos directivos que utilizan tanto escritorio como tabletas.
- **Botones activos**: accesos rápidos (centro de ayuda, mesa de partes, tutoría y restablecimiento de contraseña) muestran confirmaciones inmediatas para que la interfaz no quede estática.

## Uso

1. Abre el archivo `index.html` en tu navegador favorito. La aplicación precarga un padrón base embebido desde el inicio para que el flujo funcione incluso sin servidor o antes de que se lean los JSON externos.
2. Elige el tipo de acceso (docente o estudiante) y presiona **Acceder**: los campos se rellenan con la cuenta de ejemplo para que el inicio no se quede estático.
   - Docente: `clasico3040@gmail.com` · contraseña `docente123`
   - Estudiante: `karter1314@gmail.com` · contraseña `alumno123`
3. Según el perfil seleccionado se mostrará la interfaz dedicada:
- **Docentes**: ingresan al **Espacio docente**, donde pueden enviar tareas a sus cursos y compartir presentaciones o videos para apoyar cada sesión.
   - **Estudiantes**: visualizan el **Panel del estudiante**, con promedios, asistencias, agenda personal, reproductor de videos compartidos y listado de tareas recibidas por sus docentes.

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

## Próximos pasos sugeridos

- Integrar autenticación real y conexión con la base de datos institucional.
- Añadir gráficos dinámicos y filtros avanzados para reportes.
- Implementar persistencia de datos y servicios API para matrículas y calificaciones.
