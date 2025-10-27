document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginScreen = document.getElementById('login-screen');
  const mainLayout = document.getElementById('main-layout');
  const sectionTitle = document.getElementById('section-title');
  const subtitle = document.querySelector('.subtitle');
  const navButtons = Array.from(document.querySelectorAll('.nav-item'));
  const logoutButton = document.getElementById('logout-button');
  const emailInput = loginForm?.querySelector('input[type="email"]');
  const passwordInput = loginForm?.querySelector('input[type="password"]');
  const roleTabs = document.querySelectorAll('.role-tab');
  const roleHeading = document.getElementById('role-heading');
  const roleDescription = document.getElementById('role-description');
  const loginRoleInput = document.getElementById('login-role');
  const loginSubmit = document.getElementById('login-submit');
  const userAvatar = document.querySelector('.user-chip .avatar');
  const userName = document.querySelector('.user-chip strong');
  const userRole = document.querySelector('.user-chip small');
  const STORAGE_KEY = 'siagiePlusCredentials';

  const storage = getStorage();
  const body = document.body;

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

  const titleMap = {
    dashboard: 'Panel general',
    students: 'Gestión de estudiantes',
    teachers: 'Gestión de docentes',
    grades: 'Registro de calificaciones',
    reports: 'Reportes y analítica',
    calendar: 'Agenda institucional'
  };

  const roleMetadata = {
    admin: {
      heading: 'Acceso administrativo',
      description:
        'Supervisa matrículas, reportes y la gestión integral de la institución educativa.',
      submitLabel: 'Acceder como administrativo',
      user: {
        name: 'Carlos Luis Huamán Manrique',
        detail: 'Director IE 3058',
        initials: 'CH'
      },
      defaultSection: 'dashboard'
    },
    teacher: {
      heading: 'Acceso docente',
      description:
        'Registra calificaciones, revisa la asistencia y mantén comunicación con tus aulas asignadas.',
      submitLabel: 'Acceder como docente',
      user: {
        name: 'María Elena Rojas',
        detail: 'Docente de Comunicación',
        initials: 'MR'
      },
      defaultSection: 'grades'
    },
    student: {
      heading: 'Acceso estudiante',
      description:
        'Consulta tus calificaciones, seguimiento académico y actividades planificadas.',
      submitLabel: 'Acceder como estudiante',
      user: {
        name: 'Lucía Herrera',
        detail: 'Estudiante 4.º de secundaria',
        initials: 'LH'
      },
      defaultSection: 'grades'
    }
  };

  const credentialsByRole = {
    admin: { email: '', password: '' },
    teacher: { email: '', password: '' },
    student: { email: '', password: '' }
  };

  let activeRole = 'admin';

  restoreSavedState();
  updateRoleUI();
  populateCredentialsFields();
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
      captureCurrentCredentials();
      persistState();
      setAuthenticatedState(true);
    });

    logoutButton?.addEventListener('click', () => {
      setAuthenticatedState(false);
    });

    [emailInput, passwordInput].forEach((input) => {
      input?.addEventListener('input', () => {
        captureCurrentCredentials();
        persistState();
      });
    });

    roleTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const { role } = tab.dataset;
        if (!role || role === activeRole) {
          return;
        }

        captureCurrentCredentials();
        activeRole = role;
        updateRoleUI();
        populateCredentialsFields();
        persistState();
      });
    });

    navButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.hidden) return;
        activateSection(button.dataset.target);
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
      applyRoleProfile(activeRole);
    } else {
      body.style.alignItems = 'center';
      body.style.justifyContent = 'center';
      configureNavigationForRole(activeRole);
      updateRoleUI();
      populateCredentialsFields();
    }
  }

  function updateRoleUI() {
    const metadata = roleMetadata[activeRole];
    if (!metadata) {
      return;
    }

    roleTabs.forEach((tab) => {
      const isActive = tab.dataset.role === activeRole;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    if (loginRoleInput) {
      loginRoleInput.value = activeRole;
    }

    if (roleHeading) {
      roleHeading.textContent = metadata.heading;
    }

    if (roleDescription) {
      roleDescription.textContent = metadata.description;
    }

    if (loginSubmit) {
      loginSubmit.textContent = metadata.submitLabel;
    }
  }

  function populateCredentialsFields() {
    const record = credentialsByRole[activeRole] ?? { email: '', password: '' };
    if (emailInput) {
      emailInput.value = record.email ?? '';
    }

    if (passwordInput) {
      passwordInput.value = record.password ?? '';
    }
  }

  function captureCurrentCredentials() {
    if (!credentialsByRole[activeRole]) {
      return;
    }

    credentialsByRole[activeRole] = {
      email: emailInput?.value ?? '',
      password: passwordInput?.value ?? ''
    };
  }

  function applyRoleProfile(role) {
    const metadata = roleMetadata[role];
    if (!metadata) {
      return;
    }

    if (userName) {
      userName.textContent = metadata.user.name;
    }

    if (userRole) {
      userRole.textContent = metadata.user.detail;
    }

    if (userAvatar) {
      userAvatar.textContent = metadata.user.initials;
    }

    configureNavigationForRole(role, metadata.defaultSection);
  }

  function configureNavigationForRole(role, preferredSection = 'dashboard') {
    let firstVisibleSection = null;

    navButtons.forEach((button) => {
      const allowed = (button.dataset.roles || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const isVisible = allowed.length === 0 || allowed.includes(role);
      button.hidden = !isVisible;

      if (!isVisible) {
        button.classList.remove('active');
        return;
      }

      if (!firstVisibleSection) {
        firstVisibleSection = button.dataset.target;
      }
    });

    const sectionToActivate =
      preferredSection && isSectionAvailable(preferredSection)
        ? preferredSection
        : firstVisibleSection;

    if (sectionToActivate) {
      activateSection(sectionToActivate);
    }
  }

  function isSectionAvailable(sectionId) {
    return navButtons.some(
      (button) => !button.hidden && button.dataset.target === sectionId
    );
  }

  function activateSection(target) {
    if (!target) {
      return;
    }

    document.querySelectorAll('.panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === target);
    });

    navButtons.forEach((button) => {
      const isActive = !button.hidden && button.dataset.target === target;
      button.classList.toggle('active', isActive);
    });

    if (sectionTitle) {
      sectionTitle.textContent = titleMap[target] ?? titleMap.dashboard;
    }

    if (subtitle) {
      subtitle.textContent = panelDescriptions[target] ?? panelDescriptions.dashboard;
    }
  }

  function persistState() {
    if (!storage) {
      return;
    }

    try {
      storage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeRole,
          credentials: credentialsByRole
        })
      );
    } catch (error) {
      console.error('No se pudieron guardar las credenciales.', error);
    }
  }

  function restoreSavedState() {
    const saved = readStoredState();
    if (!saved) {
      return;
    }

    if (saved.activeRole && roleMetadata[saved.activeRole]) {
      activeRole = saved.activeRole;
    }

    Object.keys(credentialsByRole).forEach((role) => {
      credentialsByRole[role] = {
        email: saved.credentials?.[role]?.email ?? '',
        password: saved.credentials?.[role]?.password ?? ''
      };
    });
  }

  function readStoredState() {
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
