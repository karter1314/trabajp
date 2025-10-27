# SIAGIE+ Plataforma Educativa

Una interfaz moderna inspirada en el Sistema de Información de Apoyo a la Gestión de la Institución Educativa (SIAGIE), con mejoras de diseño y experiencia de usuario. Esta versión incluye un flujo de autenticación simulado, panel administrativo y módulos visuales para gestionar estudiantes, docentes, calificaciones, reportes y agenda institucional.

## Características principales

- **Pantalla de acceso renovada** con diseño gradiente, tarjetas informativas y soporte para recordatorio de dispositivo.
- **Accesos diferenciados** que redirigen a espacios independientes para administrativos, docentes y estudiantes, recordando las credenciales de cada perfil.
- **Panel administrativo** con indicadores clave, seguimiento de matrículas, reportes institucionales y agenda general.
- **Espacio docente** dedicado con horarios por aula, registro rápido de calificaciones y formulario para reportar inconsistencias en los datos de estudiantes.
- **Panel del estudiante** orientado a la consulta de resultados, asistencias y agenda personal con accesos directos a tutoría.
- **Gestión de accesos administrativos** para registrar nuevas personas, asignarles rol (docente o estudiante) y reflejar al instante los cambios en las tablas correspondientes.
- **Diseño responsive** pensado para equipos directivos que utilizan tanto escritorio como tabletas.

## Uso

1. Abre el archivo `index.html` en tu navegador favorito.
2. Elige el tipo de acceso (administrativo, docente o estudiante), ingresa el correo institucional sugerido para cada rol y presiona **Acceder**.
   - Administrativo: `bj210806@gmail.com`
   - Docente: `clasico3040@gmail.com`
   - Estudiante: `karter1314@gmail.com`
3. Según el perfil seleccionado se mostrará la interfaz dedicada:
   - **Administrativos**: acceden a un panel con barra lateral verde para recorrer módulos de matrículas, docentes, reportes, agenda y la sección de **Gestión de accesos**.
   - **Docentes**: ingresan al **Espacio docente**, donde pueden revisar horarios, registrar calificaciones y enviar reportes de incidencias en un entorno independiente.
   - **Estudiantes**: visualizan el **Panel del estudiante**, con promedios, asistencias, agenda personal y accesos directos para contactar a tutoría.

## Tecnologías

- HTML5 semántico
- CSS3 con variables y layout responsive
- JavaScript (ES6) para navegación y autenticación simulada

## Próximos pasos sugeridos

- Integrar autenticación real y conexión con la base de datos del SIAGIE oficial.
- Añadir gráficos dinámicos y filtros avanzados para reportes.
- Implementar persistencia de datos y servicios API para matrículas y calificaciones.
