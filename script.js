document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginScreen = document.getElementById('login-screen');
  const mainLayout = document.getElementById('main-layout');
  const sectionTitle = document.getElementById('section-title');
  const subtitle = document.querySelector('.subtitle');
  const navButtons = document.querySelectorAll('.nav-item');
  const logoutButton = document.getElementById('logout-button');
  const emailInput = loginForm?.querySelector('input[type="email"]');
  const passwordInput = loginForm?.querySelector('input[type="password"]');
  const STORAGE_KEY = 'siagiePlusCredentials';
  const storage = getStorage();

  const panelDescriptions = {
    dashboard: 'Visualiza el estado académico y administrativo de tu institución.',
    students:
      'Gestiona la información de los estudiantes, actualiza sus datos y monitorea su progreso académico.',
    teachers:
      'Administra la información de tus docentes y organiza su disponibilidad desde un solo lugar.',
    grades:
      'Captura y consolida las calificaciones por competencias de cada área curricular.',
    reports:
      'Genera reportes institucionales, indicadores MINEDU y seguimientos personalizados.',
    calendar:
      'Coordina actividades académicas, evaluaciones y eventos comunitarios desde un único calendario.'
  };

  const body = document.body;

  restoreSavedCredentials();
  setInitialView();
  attachEventHandlers();

  function setInitialView() {
    if (loginScreen) {
      loginScreen.hidden = false;
    }

    if (mainLayout) {
      mainLayout.hidden = true;
    }
    body.style.alignItems = 'center';
    body.style.justifyContent = 'center';
  }

  function attachEventHandlers() {
    loginForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      persistCredentials();
      setAuthenticatedState(true);
    });

    logoutButton?.addEventListener('click', () => {
      setAuthenticatedState(false);
    });

    [emailInput, passwordInput].forEach((input) => {
      input?.addEventListener('input', () => {
        persistCredentials();
      });
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

        if (sectionTitle) {
          sectionTitle.textContent = titleMap[target] ?? 'Panel general';
        }

        if (subtitle) {
          subtitle.textContent = panelDescriptions[target] ?? panelDescriptions.dashboard;
        }
      });
    });
  }

  function setAuthenticatedState(isAuthenticated) {
    if (!loginScreen || !mainLayout) return;

    loginScreen.hidden = isAuthenticated;
    mainLayout.hidden = !isAuthenticated;

    if (isAuthenticated) {
      body.style.alignItems = 'stretch';
      body.style.justifyContent = 'stretch';
    } else {
      body.style.alignItems = 'center';
      body.style.justifyContent = 'center';
    }
  }

  function restoreSavedCredentials() {
    if (!storage) return;

    const saved = readStoredCredentials();

    if (saved?.email && emailInput) {
      emailInput.value = saved.email;
    }

    if (typeof saved?.password === 'string' && passwordInput) {
      passwordInput.value = saved.password;
    }
  }

  function persistCredentials() {
    if (!storage) return;

    const credentials = {
      email: emailInput?.value ?? '',
      password: passwordInput?.value ?? ''
    };

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    } catch (error) {
      console.error('No se pudieron guardar las credenciales.', error);
    }
  }

  function readStoredCredentials() {
    try {
      const raw = storage?.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('No se pudieron leer las credenciales guardadas.', error);
      return null;
    }
  }

  function getStorage() {
    try {
      if (typeof window === 'undefined' || !('localStorage' in window)) {
        return null;
      }

      const testKey = '__siagie-test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch (error) {
      console.warn('El almacenamiento local no está disponible.', error);
      return null;
    }
  }
});
