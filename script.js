const loginForm = document.getElementById('login-form');
const loginScreen = document.getElementById('login-screen');
const mainLayout = document.getElementById('main-layout');
const sectionTitle = document.getElementById('section-title');
const subtitle = document.querySelector('.subtitle');
const navButtons = document.querySelectorAll('.nav-item');
const logoutButton = document.getElementById('logout-button');
const modals = document.querySelectorAll('.modal');

const panelDescriptions = {
  dashboard: 'Visualiza el estado académico y administrativo de tu institución.',
  students:
    'Registra nuevos estudiantes, actualiza sus datos y monitorea su progreso académico.',
  teachers:
    'Administra la información de tus docentes y asigna cursos de forma rápida.',
  grades:
    'Captura y consolida las calificaciones por competencias de cada área curricular.',
  reports:
    'Genera reportes institucionales, indicadores MINEDU y seguimientos personalizados.',
  calendar:
    'Coordina actividades académicas, evaluaciones y eventos comunitarios desde un único calendario.'
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginScreen.hidden = true;
  mainLayout.hidden = false;
  document.body.style.alignItems = 'stretch';
  document.body.style.justifyContent = 'stretch';
});

logoutButton.addEventListener('click', () => {
  mainLayout.hidden = true;
  loginScreen.hidden = false;
  document.body.style.alignItems = 'center';
  document.body.style.justifyContent = 'center';
});

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;

    document.querySelectorAll('.panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === target);
    });

    navButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    const titleMap = {
      dashboard: 'Panel general',
      students: 'Gestión de estudiantes',
      teachers: 'Gestión de docentes',
      grades: 'Registro de calificaciones',
      reports: 'Reportes y analítica',
      calendar: 'Agenda institucional'
    };

    sectionTitle.textContent = titleMap[target] ?? 'Panel general';
    subtitle.textContent = panelDescriptions[target] ?? panelDescriptions.dashboard;
  });
});

// Modal handling
const openModalButtons = document.querySelectorAll('[data-modal]');
const closeModalButtons = document.querySelectorAll('[data-close]');

openModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modalId = button.dataset.modal;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.hidden = false;
      document.body.classList.add('modal-open');
    }
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    if (modal) {
      modal.hidden = true;
      document.body.classList.remove('modal-open');
    }
  });
});

modals.forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.hidden = true;
      document.body.classList.remove('modal-open');
    }
  });
});

// Prevent submit to avoid page reload for sample forms
modals.forEach((modal) => {
  modal.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      modal.hidden = true;
      document.body.classList.remove('modal-open');
    });
  });
});
