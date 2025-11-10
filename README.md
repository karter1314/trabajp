# SISE Plataforma Educativa

Una interfaz moderna para la plataforma SISE, con mejoras de diseño y experiencia de usuario. Esta versión incluye un flujo de autenticación simulado y espacios visuales dedicados para docentes y estudiantes, abarcando calificaciones, horarios, reportes y agenda institucional.

## Características principales

- **Pantalla de acceso renovada** con diseño gradiente, tarjetas informativas y soporte para recordatorio de dispositivo.
- **Accesos diferenciados** que redirigen a espacios independientes para docentes y estudiantes, recordando las credenciales de cada perfil.
- **Espacio docente** dedicado con horarios por aula, calendario semanal de referencia, registro rápido de calificaciones, envío de tareas con archivos de apoyo y videos de clase, además de un formulario para reportar inconsistencias en los datos de estudiantes.
- **Panel del estudiante** orientado a la consulta de resultados, asistencias y agenda personal, con horario semanal, reproductor de videos adjuntos y un buzón que muestra automáticamente las tareas enviadas por los docentes.
- **Plantillas ampliadas** con 10 docentes y 20 estudiantes de muestra que enriquecen las tablas y permiten visualizar la gestión de aulas más completa.
- **Diseño responsive** pensado para equipos directivos que utilizan tanto escritorio como tabletas.

## Uso

1. Abre el archivo `index.html` en tu navegador favorito.
2. Elige el tipo de acceso (docente o estudiante), ingresa el correo institucional almacenado en la base de datos (`data/usuarios.json`) y presiona **Acceder**.
   - Docente: `clasico3040@gmail.com` · contraseña `docente123`
   - Estudiante: `karter1314@gmail.com` · contraseña `alumno123`
3. Según el perfil seleccionado se mostrará la interfaz dedicada:
- **Docentes**: ingresan al **Espacio docente**, donde pueden revisar horarios, registrar calificaciones y enviar tareas con instrucciones, archivos adjuntos y videos de clase.
   - **Estudiantes**: visualizan el **Panel del estudiante**, con promedios, asistencias, agenda personal, reproductor de videos compartidos y listado de tareas recibidas por sus docentes.

## Tecnologías

- HTML5 semántico
- CSS3 con variables y layout responsive
- JavaScript (ES6) para navegación y autenticación simulada

## Base de datos de accesos

- El padrón de cuentas se carga automáticamente desde `data/usuarios.json`, un archivo JSON pensado para exportarse desde Excel/Sheets (guardar como CSV y convertir a JSON).
- Cada registro puede incluir `email`, `password`, `name`, `detail` e `initials`. La aplicación normaliza los datos y utiliza los valores para personalizar los encabezados de cada rol.
- Para actualizar la base de accesos, edita `data/usuarios.json` directamente (puedes exportar desde Excel como CSV y convertirlo a JSON).
- Si quieres volver al padrón original, elimina la clave `siseDirectory` del almacenamiento local del navegador y recarga la página. También puedes limpiar las credenciales guardadas borrando `siseCredentials`.
- Si abres el proyecto directamente como archivo (`file://`), algunos navegadores bloquean la lectura del JSON. Usa un servidor local ligero (por ejemplo, Live Server de VS Code o `python -m http.server`).

## Próximos pasos sugeridos

- Integrar autenticación real y conexión con la base de datos institucional.
- Añadir gráficos dinámicos y filtros avanzados para reportes.
- Implementar persistencia de datos y servicios API para matrículas y calificaciones.
