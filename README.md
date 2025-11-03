# SIAGIE+ Plataforma Educativa

Una interfaz moderna inspirada en el Sistema de Información de Apoyo a la Gestión de la Institución Educativa (SIAGIE), con mejoras de diseño y experiencia de usuario. Esta versión incluye un flujo de autenticación simulado, panel administrativo y módulos visuales para gestionar estudiantes, docentes, calificaciones, reportes y agenda institucional.

## Características principales

- **Pantalla de acceso renovada** con diseño gradiente, tarjetas informativas y soporte para recordatorio de dispositivo.
- **Accesos diferenciados** que redirigen a espacios independientes para administrativos, docentes y estudiantes, recordando las credenciales de cada perfil.
- **Panel administrativo** con indicadores clave, seguimiento de matrículas, reportes institucionales y agenda general.
- **Espacio docente** dedicado con horarios por aula, calendario semanal de referencia, registro rápido de calificaciones, envío de tareas con archivos de apoyo y formulario para reportar inconsistencias en los datos de estudiantes.
- **Panel del estudiante** orientado a la consulta de resultados, asistencias y agenda personal, con horario semanal y un buzón que muestra automáticamente las tareas enviadas por los docentes.
- **Plantillas ampliadas** con 10 docentes y 20 estudiantes de muestra que enriquecen las tablas y permiten visualizar la gestión de aulas más completa.
- **Gestión de accesos administrativos** para registrar nuevas personas, asignarles rol (docente o estudiante) y reflejar al instante los cambios en las tablas correspondientes.
- **Diseño responsive** pensado para equipos directivos que utilizan tanto escritorio como tabletas.

## Uso

1. Abre el archivo `index.html` en tu navegador favorito.
2. Elige el tipo de acceso (administrativo, docente o estudiante), ingresa el correo institucional almacenado en la base de datos (`data/usuarios.json`) y presiona **Acceder**.
   - Administrativo: `bj210806@gmail.com` · contraseña `admin123`
   - Docente: `clasico3040@gmail.com` · contraseña `docente123`
   - Estudiante: `karter1314@gmail.com` · contraseña `alumno123`
3. Según el perfil seleccionado se mostrará la interfaz dedicada:
   - **Administrativos**: acceden a un panel con barra lateral verde para recorrer módulos de matrículas, docentes, reportes, agenda y la sección de **Gestión de accesos**.
  - **Docentes**: ingresan al **Espacio docente**, donde pueden revisar horarios, registrar calificaciones, enviar tareas con instrucciones y archivos adjuntos, además de reportar incidencias de datos.
  - **Estudiantes**: visualizan el **Panel del estudiante**, con promedios, asistencias, agenda personal, acceso a los archivos de apoyo y listado de tareas recibidas por sus docentes.

## Tecnologías

- HTML5 semántico
- CSS3 con variables y layout responsive
- JavaScript (ES6) para navegación y autenticación simulada

## Base de datos de accesos

- El padrón de cuentas se carga automáticamente desde `data/usuarios.json`, un archivo JSON pensado para exportarse desde Excel/Sheets (guardar como CSV y convertir a JSON).
- Cada registro puede incluir `email`, `password`, `name`, `detail` e `initials`. La aplicación normaliza los datos y utiliza los valores para personalizar los encabezados de cada rol.
- Para añadir o modificar cuentas, edita el archivo y actualiza la lista correspondiente (`admin`, `teacher`, `student`). Los cambios se reflejarán al recargar la página.
- Si abres el proyecto directamente como archivo (`file://`), algunos navegadores bloquean la lectura del JSON. Usa un servidor local ligero (por ejemplo, Live Server de VS Code o `python -m http.server`).

## Próximos pasos sugeridos

- Integrar autenticación real y conexión con la base de datos del SIAGIE oficial.
- Añadir gráficos dinámicos y filtros avanzados para reportes.
- Implementar persistencia de datos y servicios API para matrículas y calificaciones.
