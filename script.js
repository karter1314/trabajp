document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginScreen = document.getElementById('login-screen');
  const adminLayout = document.getElementById('admin-layout');
  const teacherLayout = document.getElementById('teacher-layout');
  const studentLayout = document.getElementById('student-layout');
  const sectionTitle = adminLayout?.querySelector('#section-title');
  const subtitle = adminLayout?.querySelector('.subtitle');
  const adminNavButtons = adminLayout
    ? Array.from(adminLayout.querySelectorAll('.nav-item'))
    : [];
  const logoutButtons = Array.from(document.querySelectorAll('[data-logout]'));
  const emailInput = loginForm?.querySelector('input[type="email"]');
  const passwordInput = loginForm?.querySelector('input[type="password"]');
  const roleTabs = document.querySelectorAll('.role-tab');
  const roleHeading = document.getElementById('role-heading');
  const roleDescription = document.getElementById('role-description');
  const loginRoleInput = document.getElementById('login-role');
  const loginSubmit = document.getElementById('login-submit');
  const loginFeedback = document.getElementById('login-feedback');
  const adminAvatar = adminLayout?.querySelector('.user-chip .avatar');
  const adminName = adminLayout?.querySelector('.user-chip strong');
  const adminRole = adminLayout?.querySelector('.user-chip small');
  const teacherAvatar = document.getElementById('teacher-avatar');
  const teacherName = document.getElementById('teacher-name');
  const teacherDetail = document.getElementById('teacher-detail');
  const studentAvatar = document.getElementById('student-avatar');
  const studentName = document.getElementById('student-name');
  const studentDetail = document.getElementById('student-detail');
  const accessForm = document.getElementById('access-form');
  const accessRoleSelect = document.getElementById('access-role');
  const roleFieldBlocks = document.querySelectorAll('[data-role-fields]');
  const assignmentList = document.getElementById('assignment-list');
  const noRecordsMessage = document.getElementById('no-records');
  const pendingCount = document.getElementById('pending-count');
  const studentsDynamicBody = document.getElementById('students-dynamic');
  const teachersDynamicBody = document.getElementById('teachers-dynamic');
  const teacherCount = document.getElementById('teacher-count');
  const scheduleDaySelect = document.getElementById('schedule-day');
  const scheduleBody = document.getElementById('schedule-body');
  const scheduleRoom = document.getElementById('schedule-room');
  const gradeForm = document.getElementById('grade-form');
  const gradeCourseSelect = document.getElementById('grade-course');
  const gradeTableBody = document.getElementById('grade-table-body');
  const gradeFeedback = document.getElementById('grade-feedback');
  const gradeResetButton = document.getElementById('grade-reset');
  const gradeHistoryList = document.getElementById('grade-history');
  const gradeHistoryEmpty = document.getElementById('grade-history-empty');
  const dataIssueForm = document.getElementById('data-issue-form');
  const dataIssueList = document.getElementById('data-issue-list');
  const dataIssueEmpty = document.getElementById('data-issue-empty');
  const issueFeedback = document.getElementById('issue-feedback');
  const STORAGE_KEY = 'siagiePlusCredentials';
  const DIRECTORY_PATH = 'data/usuarios.json';

  const storage = getStorage();
  const body = document.body;

  const gradeOptions = [
    'Inicial',
    '1° Primaria',
    '2° Primaria',
    '3° Primaria',
    '4° Primaria',
    '5° Primaria',
    '6° Primaria',
    '1° Secundaria',
    '2° Secundaria',
    '3° Secundaria',
    '4° Secundaria',
    '5° Secundaria'
  ];

  const statusOptions = ['Regular', 'Pendiente', 'Traslado', 'Evaluación'];

  const gradeScale = ['AD', 'A', 'B', 'C'];

  const availabilityOptions = [
    'Turno completo',
    'Turno mañana',
    'Turno tarde',
    'Horas parciales'
  ];

  const BASE_TEACHER_COUNT = document.querySelectorAll('#teachers-base tr').length;

  const teacherSchedule = [
    {
      id: 'lunes',
      label: 'Lunes',
      sessions: [
        {
          time: '07:30 - 09:00',
          course: 'Comunicación',
          section: '2.º Secundaria B',
          room: 'Aula 204'
        },
        {
          time: '09:15 - 10:45',
          course: 'Comunicación',
          section: '3.º Secundaria A',
          room: 'Laboratorio de idiomas'
        },
        {
          time: '11:15 - 12:30',
          course: 'Tutoría',
          section: '1.º Secundaria C',
          room: 'Aula 108'
        }
      ]
    },
    {
      id: 'martes',
      label: 'Martes',
      sessions: [
        {
          time: '08:00 - 09:30',
          course: 'Comunicación',
          section: '4.º Secundaria A',
          room: 'Aula 305'
        },
        {
          time: '09:45 - 11:15',
          course: 'Proyecto STEAM',
          section: '2.º Secundaria B',
          room: 'Sala de innovación'
        }
      ]
    },
    {
      id: 'miercoles',
      label: 'Miércoles',
      sessions: [
        {
          time: '07:30 - 09:00',
          course: 'Comunicación',
          section: '2.º Secundaria B',
          room: 'Aula 204'
        },
        {
          time: '09:15 - 10:45',
          course: 'Comunicación',
          section: '5.º Secundaria C',
          room: 'Aula 401'
        },
        {
          time: '11:00 - 11:45',
          course: 'Consejería',
          section: 'Docentes noveles',
          room: 'Sala de profesores'
        }
      ]
    },
    {
      id: 'jueves',
      label: 'Jueves',
      sessions: [
        {
          time: '08:00 - 09:30',
          course: 'Comunicación',
          section: '3.º Secundaria B',
          room: 'Aula 210'
        },
        {
          time: '09:45 - 11:15',
          course: 'Comunicación',
          section: '5.º Secundaria C',
          room: 'Aula 401'
        }
      ]
    },
    {
      id: 'viernes',
      label: 'Viernes',
      sessions: [
        {
          time: '07:30 - 09:00',
          course: 'Comunicación',
          section: '1.º Secundaria C',
          room: 'Aula 108'
        },
        {
          time: '09:15 - 10:45',
          course: 'Comunicación',
          section: '4.º Secundaria A',
          room: 'Aula 305'
        },
        {
          time: '11:00 - 11:45',
          course: 'Reunión con familias',
          section: '2.º Secundaria B',
          room: 'Sala de reuniones'
        }
      ]
    }
  ];

  const teacherCourses = [
    {
      id: 'comunicacion-2b',
      name: 'Comunicación · 2.º Secundaria B',
      group: '2.º Secundaria B',
      room: 'Aula 204',
      students: [
        { id: 'andrea-paredes', name: 'Andrea Paredes', grade: 'AD' },
        { id: 'carlos-ramos', name: 'Carlos Ramos', grade: 'B' },
        { id: 'lucia-torres', name: 'Lucía Torres', grade: 'A' },
        { id: 'valeria-nunez', name: 'Valeria Núñez', grade: 'A' },
        { id: 'diego-herrera', name: 'Diego Herrera', grade: 'B' }
      ]
    },
    {
      id: 'comunicacion-4a',
      name: 'Comunicación · 4.º Secundaria A',
      group: '4.º Secundaria A',
      room: 'Aula 305',
      students: [
        { id: 'sofia-leon', name: 'Sofía León', grade: 'AD' },
        { id: 'renato-ibanez', name: 'Renato Ibañez', grade: 'A' },
        { id: 'ana-castro', name: 'Ana Castro', grade: 'A' },
        { id: 'gabriel-lopez', name: 'Gabriel López', grade: 'B' }
      ]
    },
    {
      id: 'comunicacion-5c',
      name: 'Comunicación · 5.º Secundaria C',
      group: '5.º Secundaria C',
      room: 'Aula 401',
      students: [
        { id: 'mariana-silva', name: 'Mariana Silva', grade: 'A' },
        { id: 'jorge-vizcarra', name: 'Jorge Vizcarra', grade: 'B' },
        { id: 'paula-gomez', name: 'Paula Gómez', grade: 'AD' },
        { id: 'sebastian-cortes', name: 'Sebastián Cortés', grade: 'A' }
      ]
    }
  ];

  const gradeHistory = [];
  const dataIssueRequests = [];

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
      'Coordina actividades académicas, evaluaciones y eventos comunitarios desde un único calendario.',
    'access-management':
      'Define el rol de las nuevas personas registradas y completa sus datos antes de habilitarlas en la plataforma.'
  };

  const titleMap = {
    dashboard: 'Panel general',
    students: 'Gestión de estudiantes',
    teachers: 'Gestión de docentes',
    grades: 'Registro de calificaciones',
    reports: 'Reportes y analítica',
    calendar: 'Agenda institucional',
    'access-management': 'Gestión de accesos'
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
      defaultSection: 'teacher-hub'
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
      defaultSection: 'student-overview'
    }
  };

  const accessDirectory = {
    admin: [],
    teacher: [],
    student: []
  };

  const credentialsByRole = {
    admin: { email: '', password: '' },
    teacher: { email: '', password: '' },
    student: { email: '', password: '' }
  };

  let activeRole = 'admin';

  const newRecords = [];
  let recordIdCounter = 1;

  restoreSavedState();
  updateRoleUI();
  populateCredentialsFields();
  setInitialView();
  initializeTeacherWorkspace();
  loadAccessDirectory();
  attachEventHandlers();
  toggleRoleFields(accessRoleSelect?.value ?? 'student');
  updateCounters();

  function setInitialView() {
    if (loginScreen) {
      loginScreen.hidden = false;
    }

    hideAllLayouts();
    body.style.alignItems = 'center';
    body.style.justifyContent = 'center';
  }

  function attachEventHandlers() {
    loginForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (validateCredentials()) {
        captureCurrentCredentials();
        persistState();
        setAuthenticatedState(true);
        showLoginFeedback('Acceso concedido.', 'success');
      }
    });

    logoutButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setAuthenticatedState(false);
      });
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
        showLoginFeedback('', '');
        persistState();
      });
    });

    adminNavButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.hidden) return;
        activateAdminSection(button.dataset.target);
      });
    });

    accessRoleSelect?.addEventListener('change', () => {
      toggleRoleFields(accessRoleSelect.value);
    });

    accessForm?.addEventListener('submit', handleAccessFormSubmit);

    assignmentList?.addEventListener('change', handleAssignmentInteraction);
    assignmentList?.addEventListener('input', handleAssignmentInteraction);

    scheduleDaySelect?.addEventListener('change', () => {
      renderSchedule(scheduleDaySelect.value);
    });

    gradeCourseSelect?.addEventListener('change', () => {
      renderGradeTable(gradeCourseSelect.value);
      clearGradeFeedback();
    });

    gradeResetButton?.addEventListener('click', () => {
      resetGradeSelections();
      clearGradeFeedback();
    });

    gradeForm?.addEventListener('submit', handleGradeFormSubmit);

    dataIssueForm?.addEventListener('submit', handleDataIssueSubmit);
  }

  async function loadAccessDirectory() {
    try {
      const response = await fetch(DIRECTORY_PATH, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Estado inesperado: ${response.status}`);
      }

      const payload = await response.json();
      ['admin', 'teacher', 'student'].forEach((role) => {
        const records = Array.isArray(payload?.[role]) ? payload[role] : [];
        accessDirectory[role] = records.map(normalizeAccount).filter((account) => account.email);
        if (!credentialsByRole[role]?.email && accessDirectory[role][0]) {
          credentialsByRole[role].email = accessDirectory[role][0].email;
        }
        if (accessDirectory[role][0]) {
          updateRoleMetadataFromAccount(role, accessDirectory[role][0], false);
        }
      });

      populateCredentialsFields();
      persistState();
    } catch (error) {
      console.error('No se pudo cargar el padrón de usuarios.', error);
      showLoginFeedback(
        'No se pudo cargar el padrón de accesos. Verifica el archivo data/usuarios.json.',
        'error'
      );
    }
  }

  function setAuthenticatedState(isAuthenticated) {
    if (!loginScreen) return;

    loginScreen.hidden = isAuthenticated;

    if (isAuthenticated) {
      body.style.alignItems = 'stretch';
      body.style.justifyContent = 'stretch';
      showLayoutForRole(activeRole);
      showLoginFeedback('', '');
    } else {
      body.style.alignItems = 'center';
      body.style.justifyContent = 'center';
      hideAllLayouts();
      if (activeRole === 'admin') {
        configureAdminNavigation(roleMetadata.admin.defaultSection);
      }
      updateRoleUI();
      populateCredentialsFields();
    }
  }

  function getFirstAccountForRole(role) {
    const list = accessDirectory[role];
    if (!Array.isArray(list) || !list.length) {
      return null;
    }
    return list[0];
  }

  function updateRoleMetadataFromAccount(role, account, preferExisting = false) {
    const metadata = roleMetadata[role];
    if (!metadata || !account) {
      return;
    }

    const name = account.name?.trim();
    const detail = account.detail?.trim();
    const initials = account.initials?.trim() || buildInitials(name || account.email);

    if (!preferExisting || !metadata.user.name) {
      if (name) {
        metadata.user.name = name;
      }
    }

    if (!preferExisting || !metadata.user.detail) {
      if (detail) {
        metadata.user.detail = detail;
      }
    }

    if (!preferExisting || !metadata.user.initials) {
      metadata.user.initials = initials;
    }
  }

  function normalizeAccount(rawAccount) {
    const email = (rawAccount?.email ?? '').trim();
    const password = typeof rawAccount?.password === 'string' ? rawAccount.password.trim() : '';
    const name = (rawAccount?.name ?? '').trim();
    const detail = (rawAccount?.detail ?? '').trim();

    return {
      email,
      emailNormalized: email.toLowerCase(),
      password,
      name,
      detail,
      initials: (rawAccount?.initials ?? '').trim() || buildInitials(name || email)
    };
  }

  function buildInitials(source) {
    if (!source) {
      return '';
    }

    const matches = source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase() ?? '');

    const initials = matches.join('');
    return initials || source[0]?.toUpperCase() || '';
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
    const record = credentialsByRole[activeRole] ?? {
      email: '',
      password: ''
    };
    const fallbackAccount = getFirstAccountForRole(activeRole);
    if (emailInput) {
      const value = record.email || fallbackAccount?.email || '';
      emailInput.value = value;
    }

    if (passwordInput) {
      passwordInput.value = record.password ?? '';
    }
  }

  function captureCurrentCredentials() {
    if (!credentialsByRole[activeRole]) {
      return;
    }

    const trimmedEmail = (emailInput?.value ?? '').trim();
    credentialsByRole[activeRole] = {
      email: trimmedEmail,
      password: passwordInput?.value ?? ''
    };
  }

  function validateCredentials() {
    if (!emailInput || !passwordInput) {
      return false;
    }

    const enteredEmail = emailInput.value.trim().toLowerCase();
    const enteredPassword = passwordInput.value.trim();

    if (!enteredEmail || !enteredPassword) {
      showLoginFeedback('Completa tu correo y contraseña institucional.', 'error');
      return false;
    }

    const directory = accessDirectory[activeRole] ?? [];
    if (!directory.length) {
      showLoginFeedback(
        'No hay cuentas registradas para este rol en la base de datos. Revisa el archivo de usuarios.',
        'error'
      );
      return false;
    }

    const matchedAccount = directory.find(
      (account) =>
        account.emailNormalized === enteredEmail &&
        (account.password ? account.password === enteredPassword : true)
    );

    if (!matchedAccount) {
      showLoginFeedback(
        'Las credenciales no coinciden con el padrón institucional registrado para este acceso.',
        'error'
      );
      return false;
    }

    updateRoleMetadataFromAccount(activeRole, matchedAccount);
    return true;
  }

  function showLoginFeedback(message, variant) {
    if (!loginFeedback) {
      return;
    }

    loginFeedback.textContent = message;
    loginFeedback.classList.remove('error', 'success');

    if (variant === 'error') {
      loginFeedback.classList.add('error');
    } else if (variant === 'success') {
      loginFeedback.classList.add('success');
    }
  }

  function applyRoleProfile(role) {
    const metadata = roleMetadata[role];
    if (!metadata) {
      return;
    }

    if (role === 'admin') {
      if (adminName) {
        adminName.textContent = metadata.user.name;
      }

      if (adminRole) {
        adminRole.textContent = metadata.user.detail;
      }

      if (adminAvatar) {
        adminAvatar.textContent = metadata.user.initials;
      }

      configureAdminNavigation(metadata.defaultSection);
      return;
    }

    if (role === 'teacher') {
      if (teacherName) {
        teacherName.textContent = metadata.user.name;
      }

      if (teacherDetail) {
        teacherDetail.textContent = metadata.user.detail;
      }

      if (teacherAvatar) {
        teacherAvatar.textContent = metadata.user.initials;
      }

      clearGradeFeedback();
      if (issueFeedback) {
        issueFeedback.textContent = '';
        issueFeedback.classList.remove('success', 'error');
      }

      if (scheduleDaySelect) {
        if (!scheduleDaySelect.value && teacherSchedule.length) {
          scheduleDaySelect.value = teacherSchedule[0].id;
        }
        renderSchedule(scheduleDaySelect.value || teacherSchedule[0]?.id);
      }

      if (gradeCourseSelect) {
        const selectedCourse = gradeCourseSelect.value || teacherCourses[0]?.id;
        if (selectedCourse && gradeCourseSelect.value !== selectedCourse) {
          gradeCourseSelect.value = selectedCourse;
        }
        if (selectedCourse) {
          renderGradeTable(selectedCourse);
        }
      }

      return;
    }

    if (role === 'student') {
      if (studentName) {
        studentName.textContent = metadata.user.name;
      }

      if (studentDetail) {
        studentDetail.textContent = metadata.user.detail;
      }

      if (studentAvatar) {
        studentAvatar.textContent = metadata.user.initials;
      }
    }
  }

  function showLayoutForRole(role) {
    hideAllLayouts();

    if (role === 'admin' && adminLayout) {
      adminLayout.hidden = false;
      applyRoleProfile('admin');
      return;
    }

    if (role === 'teacher' && teacherLayout) {
      teacherLayout.hidden = false;
      applyRoleProfile('teacher');
      return;
    }

    if (role === 'student' && studentLayout) {
      studentLayout.hidden = false;
      applyRoleProfile('student');
      return;
    }

    if (adminLayout) {
      adminLayout.hidden = false;
      applyRoleProfile('admin');
    }
  }

  function hideAllLayouts() {
    if (adminLayout) {
      adminLayout.hidden = true;
    }
    if (teacherLayout) {
      teacherLayout.hidden = true;
    }
    if (studentLayout) {
      studentLayout.hidden = true;
    }
  }

  function configureAdminNavigation(preferredSection = 'dashboard') {
    if (!adminLayout) {
      return;
    }

    let firstVisibleSection = null;

    adminNavButtons.forEach((button) => {
      const allowed = (button.dataset.roles || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const isVisible = allowed.length === 0 || allowed.includes('admin');
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
      preferredSection && isAdminSectionAvailable(preferredSection)
        ? preferredSection
        : firstVisibleSection;

    if (sectionToActivate) {
      activateAdminSection(sectionToActivate);
    }
  }

  function initializeTeacherWorkspace() {
    populateScheduleSelect();
    populateGradeCourses();
    clearGradeFeedback();
    if (issueFeedback) {
      issueFeedback.textContent = '';
      issueFeedback.classList.remove('success', 'error');
    }
    updateGradeHistory();
    updateDataIssueList();
  }

  function populateScheduleSelect() {
    if (!scheduleDaySelect) {
      return;
    }

    const options = teacherSchedule
      .map((day) => `<option value="${escapeAttribute(day.id)}">${escapeHtml(day.label)}</option>`)
      .join('');
    scheduleDaySelect.innerHTML = options;

    const availableDays = teacherSchedule.map((day) => day.id);
    const currentValue = availableDays.includes(scheduleDaySelect.value)
      ? scheduleDaySelect.value
      : availableDays[0];

    if (currentValue) {
      scheduleDaySelect.value = currentValue;
      renderSchedule(currentValue);
    }
  }

  function renderSchedule(dayId) {
    if (!scheduleBody) {
      return;
    }

    const day = teacherSchedule.find((item) => item.id === dayId);

    if (!day || day.sessions.length === 0) {
      scheduleBody.innerHTML =
        '<tr class="empty-state"><td colspan="4">No hay sesiones programadas.</td></tr>';
      updateScheduleRoomLabel([]);
      return;
    }

    const rows = day.sessions
      .map(
        (session) => `
          <tr>
            <td>${escapeHtml(session.time)}</td>
            <td>${escapeHtml(session.course)}</td>
            <td>${escapeHtml(session.section)}</td>
            <td>${escapeHtml(session.room)}</td>
          </tr>
        `
      )
      .join('');

    scheduleBody.innerHTML = rows;
    updateScheduleRoomLabel(day.sessions);
  }

  function updateScheduleRoomLabel(sessions) {
    if (!scheduleRoom) {
      return;
    }

    if (!sessions || sessions.length === 0) {
      scheduleRoom.textContent = 'Sin aula asignada';
      return;
    }

    const uniqueRooms = Array.from(
      new Set(sessions.map((session) => session.room).filter(Boolean))
    );

    scheduleRoom.textContent =
      uniqueRooms.length === 1 ? uniqueRooms[0] : 'Varias aulas';
  }

  function populateGradeCourses() {
    if (!gradeCourseSelect) {
      return;
    }

    const options = teacherCourses
      .map(
        (course) =>
          `<option value="${escapeAttribute(course.id)}">${escapeHtml(course.name)}</option>`
      )
      .join('');
    gradeCourseSelect.innerHTML = options;

    const availableCourses = teacherCourses.map((course) => course.id);
    const currentValue = availableCourses.includes(gradeCourseSelect.value)
      ? gradeCourseSelect.value
      : availableCourses[0];

    if (currentValue) {
      gradeCourseSelect.value = currentValue;
      renderGradeTable(currentValue);
    } else if (gradeTableBody) {
      gradeTableBody.innerHTML =
        '<tr class="empty-state"><td colspan="3">Sin estudiantes registrados.</td></tr>';
    }
  }

  function renderGradeTable(courseId) {
    if (!gradeTableBody) {
      return;
    }

    const course = teacherCourses.find((item) => item.id === courseId);

    if (!course) {
      gradeTableBody.innerHTML =
        '<tr class="empty-state"><td colspan="3">Selecciona un curso para comenzar.</td></tr>';
      return;
    }

    if (!course.students.length) {
      gradeTableBody.innerHTML =
        '<tr class="empty-state"><td colspan="3">Aún no hay estudiantes asignados.</td></tr>';
      return;
    }

    gradeTableBody.innerHTML = course.students
      .map((student) => {
        const currentGrade = gradeScale.includes(student.grade)
          ? student.grade
          : gradeScale[1];
        const options = gradeScale
          .map(
            (grade) =>
              `<option value="${grade}" ${grade === currentGrade ? 'selected' : ''}>${grade}</option>`
          )
          .join('');

        return `
          <tr data-student-id="${escapeAttribute(student.id)}">
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(course.group)}</td>
            <td>
              <select class="grade-select" data-student-id="${escapeAttribute(student.id)}">
                ${options}
              </select>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  function resetGradeSelections() {
    if (!gradeCourseSelect) {
      return;
    }
    renderGradeTable(gradeCourseSelect.value);
  }

  function clearGradeFeedback() {
    if (!gradeFeedback) {
      return;
    }

    gradeFeedback.textContent = '';
    gradeFeedback.classList.remove('success', 'error');
  }

  function handleGradeFormSubmit(event) {
    event.preventDefault();

    if (!gradeCourseSelect || !gradeTableBody) {
      return;
    }

    const course = teacherCourses.find((item) => item.id === gradeCourseSelect.value);

    if (!course) {
      clearGradeFeedback();
      return;
    }

    const gradeInputs = Array.from(
      gradeTableBody.querySelectorAll('select[data-student-id]')
    );

    if (!gradeInputs.length) {
      clearGradeFeedback();
      return;
    }

    const entries = gradeInputs.map((input) => {
      const studentId = input.dataset.studentId || '';
      const student = course.students.find((item) => item.id === studentId);
      const value = gradeScale.includes(input.value) ? input.value : gradeScale[1];

      if (student) {
        student.grade = value;
      }

      return {
        id: studentId,
        name: student?.name ?? 'Estudiante',
        grade: value
      };
    });

    if (gradeFeedback) {
      gradeFeedback.textContent = `Calificaciones enviadas para ${course.name}.`;
      gradeFeedback.classList.remove('error');
      gradeFeedback.classList.add('success');
    }

    const now = new Date();
    const summaryItems = entries.map((entry) => {
      const firstName = entry.name.split(' ')[0] || entry.name;
      return `${firstName} (${entry.grade})`;
    });

    gradeHistory.unshift({
      id: `grade-${now.getTime()}`,
      courseName: course.name,
      timestamp: now,
      summary: summaryItems,
      total: entries.length
    });

    if (gradeHistory.length > 5) {
      gradeHistory.pop();
    }

    updateGradeHistory();
    renderGradeTable(course.id);
  }

  function updateGradeHistory() {
    if (!gradeHistoryList || !gradeHistoryEmpty) {
      return;
    }

    if (!gradeHistory.length) {
      gradeHistoryList.innerHTML = '';
      gradeHistoryList.hidden = true;
      gradeHistoryEmpty.hidden = false;
      return;
    }

    gradeHistoryList.hidden = false;
    gradeHistoryEmpty.hidden = true;

    gradeHistoryList.innerHTML = gradeHistory
      .map((entry) => {
        const formattedDate = formatDateTime(entry.timestamp);
        const details = buildGradeSummary(entry.summary, entry.total);
        return `
          <li>
            <span class="tag success">Enviado</span>
            <div>
              <strong>${escapeHtml(entry.courseName)}</strong>
              <small>${escapeHtml(formattedDate)} · ${entry.total} estudiantes</small>
              <p>${escapeHtml(details)}</p>
            </div>
          </li>
        `;
      })
      .join('');
  }

  function buildGradeSummary(items, total) {
    if (!items || !items.length) {
      return 'Registros actualizados.';
    }

    const visible = items.slice(0, 3);
    const remaining = Math.max(total - visible.length, 0);
    return remaining > 0
      ? `${visible.join(', ')} y ${remaining} más`
      : visible.join(', ');
  }

  function handleDataIssueSubmit(event) {
    event.preventDefault();

    if (!dataIssueForm) {
      return;
    }

    const formData = new FormData(dataIssueForm);
    const studentName = (formData.get('studentName') || '').toString().trim();
    const issueType = (formData.get('issueType') || '').toString().trim();
    const issueDetail = (formData.get('issueDetail') || '').toString().trim();

    if (!studentName || !issueType || !issueDetail) {
      if (issueFeedback) {
        issueFeedback.textContent = 'Completa todos los campos antes de enviar.';
        issueFeedback.classList.remove('success');
        issueFeedback.classList.add('error');
      }
      return;
    }

    const timestamp = new Date();

    dataIssueRequests.unshift({
      id: `issue-${timestamp.getTime()}`,
      studentName,
      issueType,
      detail: issueDetail,
      timestamp
    });

    if (dataIssueRequests.length > 6) {
      dataIssueRequests.pop();
    }

    dataIssueForm.reset();

    if (issueFeedback) {
      issueFeedback.textContent = `Se envió la incidencia para ${studentName}.`;
      issueFeedback.classList.remove('error');
      issueFeedback.classList.add('success');
    }

    updateDataIssueList();
  }

  function updateDataIssueList() {
    if (!dataIssueList || !dataIssueEmpty) {
      return;
    }

    if (!dataIssueRequests.length) {
      dataIssueList.innerHTML = '';
      dataIssueList.hidden = true;
      dataIssueEmpty.hidden = false;
      return;
    }

    dataIssueList.hidden = false;
    dataIssueEmpty.hidden = true;

    dataIssueList.innerHTML = dataIssueRequests
      .map(
        (request) => `
          <li class="issue-item">
            <strong>${escapeHtml(request.studentName)}</strong>
            <small>${escapeHtml(request.issueType)} · ${escapeHtml(
              formatDateTime(request.timestamp)
            )}</small>
            <p>${escapeHtml(request.detail)}</p>
            <span class="issue-status">Enviado a secretaría</span>
          </li>
        `
      )
      .join('');
  }

  function formatDateTime(value) {
    if (!(value instanceof Date)) {
      return '';
    }

    try {
      return new Intl.DateTimeFormat('es-PE', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(value);
    } catch (error) {
      return value.toLocaleString();
    }
  }

  function handleAccessFormSubmit(event) {
    event.preventDefault();
    if (!accessForm) {
      return;
    }

    const formData = new FormData(accessForm);
    const fullName = (formData.get('fullName') || '').toString().trim();
    const identifier = (formData.get('identifier') || '').toString().trim();
    const selectedRole = (formData.get('role') || 'student').toString();

    if (!fullName || !identifier) {
      return;
    }

    const record = {
      id: recordIdCounter++,
      name: fullName,
      identifier,
      role: selectedRole,
      student: createEmptyStudentData(),
      teacher: createEmptyTeacherData()
    };

    if (selectedRole === 'student') {
      record.student = {
        grade: (formData.get('studentGrade') || gradeOptions[0]).toString(),
        section: (formData.get('studentSection') || '').toString().trim(),
        status: (formData.get('studentStatus') || statusOptions[0]).toString(),
        tutor: (formData.get('studentTutor') || '').toString().trim()
      };
    } else {
      record.teacher = {
        specialty: (formData.get('teacherSpecialty') || '').toString().trim(),
        availability: (formData.get('teacherAvailability') || availabilityOptions[0]).toString(),
        email: (formData.get('teacherEmail') || '').toString().trim(),
        phone: (formData.get('teacherPhone') || '').toString().trim()
      };
    }

    newRecords.unshift(record);
    renderRecords();

    accessForm.reset();
    if (accessRoleSelect) {
      accessRoleSelect.value = 'student';
    }
    toggleRoleFields('student');
  }

  function handleAssignmentInteraction(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const item = target.closest('[data-record-id]');
    if (!item) {
      return;
    }

    const record = newRecords.find((entry) => entry.id === Number(item.dataset.recordId));
    if (!record) {
      return;
    }

    if (target.classList.contains('assignment-role')) {
      const nextRole = target.value;
      if (nextRole !== record.role) {
        record.role = nextRole;
        if (record.role === 'student') {
          record.student = record.student || createEmptyStudentData();
          if (!record.student.grade) {
            record.student.grade = gradeOptions[0];
          }
          if (!record.student.status) {
            record.student.status = statusOptions[0];
          }
        } else {
          record.teacher = record.teacher || createEmptyTeacherData();
          if (!record.teacher.availability) {
            record.teacher.availability = availabilityOptions[0];
          }
        }
        renderRecords();
      }
      return;
    }

    const scope = target.dataset.scope;
    const field = target.dataset.field;
    if (!scope || !field) {
      return;
    }

    if (scope === 'student') {
      record.student = record.student || createEmptyStudentData();
      record.student[field] = target.value;
    } else if (scope === 'teacher') {
      record.teacher = record.teacher || createEmptyTeacherData();
      record.teacher[field] = target.value;
    }

    updateTables();
    updateCounters();
  }

  function renderRecords() {
    updateAssignmentList();
    updateTables();
    updateCounters();
  }

  function updateAssignmentList() {
    if (!assignmentList) {
      return;
    }

    assignmentList.innerHTML = '';

    if (newRecords.length === 0) {
      if (noRecordsMessage) {
        noRecordsMessage.hidden = false;
      }
      return;
    }

    if (noRecordsMessage) {
      noRecordsMessage.hidden = true;
    }

    const fragment = document.createDocumentFragment();
    newRecords.forEach((record) => {
      fragment.appendChild(createAssignmentItem(record));
    });
    assignmentList.appendChild(fragment);
  }

  function updateTables() {
    if (studentsDynamicBody) {
      studentsDynamicBody.innerHTML = '';
      const studentFragment = document.createDocumentFragment();
      newRecords
        .filter((record) => record.role === 'student')
        .forEach((record) => {
          const student = record.student || createEmptyStudentData();
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${escapeHtml(record.name)}</td>
            <td>${escapeHtml(student.grade || 'Por asignar')}</td>
            <td>${escapeHtml(student.section || '—')}</td>
            <td><span class="chip ${resolveStatusClass(student.status)}">${escapeHtml(
              student.status || 'Pendiente'
            )}</span></td>
            <td>${escapeHtml(student.tutor || 'Por asignar')}</td>
            <td><button class="ghost-button" type="button">Ver ficha</button></td>
          `;
          studentFragment.appendChild(row);
        });
      studentsDynamicBody.appendChild(studentFragment);
    }

    if (teachersDynamicBody) {
      teachersDynamicBody.innerHTML = '';
      const teacherFragment = document.createDocumentFragment();
      newRecords
        .filter((record) => record.role === 'teacher')
        .forEach((record) => {
          const teacher = record.teacher || createEmptyTeacherData();
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${escapeHtml(record.name)}</td>
            <td>${escapeHtml(teacher.specialty || 'Por definir')}</td>
            <td><span class="chip ${resolveAvailabilityClass(teacher.availability)}">${escapeHtml(
              teacher.availability || 'Por asignar'
            )}</span></td>
            <td>${createContactColumn(teacher.email, teacher.phone)}</td>
          `;
          teacherFragment.appendChild(row);
        });
      teachersDynamicBody.appendChild(teacherFragment);
    }
  }

  function updateCounters() {
    if (pendingCount) {
      const total = newRecords.length;
      pendingCount.textContent = `${total} ${total === 1 ? 'registro' : 'registros'}`;
    }

    if (teacherCount) {
      const teacherTotal =
        BASE_TEACHER_COUNT + newRecords.filter((record) => record.role === 'teacher').length;
      teacherCount.textContent = `${teacherTotal} docentes`;
    }
  }

  function createAssignmentItem(record) {
    const element = document.createElement('li');
    element.className = 'assignment-item';
    element.dataset.recordId = String(record.id);

    const roleLabel = record.role === 'teacher' ? 'Docente' : 'Estudiante';
    const roleChipClass = record.role === 'teacher' ? 'info' : 'success';

    element.innerHTML = `
      <div class="assignment-header">
        <div>
          <strong>${escapeHtml(record.name)}</strong>
          <small>${escapeHtml(record.identifier)}</small>
        </div>
        <span class="chip ${roleChipClass}">${roleLabel}</span>
      </div>
      <div class="assignment-body">
        <label class="field compact-field">
          <span>Rol asignado</span>
          <select class="assignment-role" data-field="role">
            <option value="student"${record.role === 'student' ? ' selected' : ''}>Estudiante</option>
            <option value="teacher"${record.role === 'teacher' ? ' selected' : ''}>Docente</option>
          </select>
        </label>
        ${renderRoleSpecificFields(record)}
      </div>
    `;

    return element;
  }

  function renderRoleSpecificFields(record) {
    if (record.role === 'student') {
      const student = record.student || createEmptyStudentData();
      return `
        <div class="assignment-fields">
          <label class="field compact-field">
            <span>Grado</span>
            <select data-scope="student" data-field="grade">
              ${gradeOptions
                .map(
                  (option) =>
                    `<option value="${escapeAttribute(option)}"${
                      option === student.grade ? ' selected' : ''
                    }>${escapeHtml(option)}</option>`
                )
                .join('')}
            </select>
          </label>
          <label class="field compact-field">
            <span>Sección</span>
            <input type="text" data-scope="student" data-field="section" placeholder="A, B, C..." value="${escapeAttribute(
              student.section
            )}" />
          </label>
          <label class="field compact-field">
            <span>Estado</span>
            <select data-scope="student" data-field="status">
              ${statusOptions
                .map(
                  (option) =>
                    `<option value="${escapeAttribute(option)}"${
                      option === student.status ? ' selected' : ''
                    }>${escapeHtml(option)}</option>`
                )
                .join('')}
            </select>
          </label>
          <label class="field compact-field">
            <span>Tutor asignado</span>
            <input type="text" data-scope="student" data-field="tutor" placeholder="Nombre del tutor" value="${escapeAttribute(
              student.tutor
            )}" />
          </label>
        </div>
      `;
    }

    const teacher = record.teacher || createEmptyTeacherData();
    return `
      <div class="assignment-fields">
        <label class="field compact-field">
          <span>Especialidad</span>
          <input type="text" data-scope="teacher" data-field="specialty" placeholder="Área o curso" value="${escapeAttribute(
            teacher.specialty
          )}" />
        </label>
        <label class="field compact-field">
          <span>Disponibilidad</span>
          <select data-scope="teacher" data-field="availability">
            ${availabilityOptions
              .map(
                (option) =>
                  `<option value="${escapeAttribute(option)}"${
                    option === teacher.availability ? ' selected' : ''
                  }>${escapeHtml(option)}</option>`
              )
              .join('')}
          </select>
        </label>
        <label class="field compact-field">
          <span>Correo institucional</span>
          <input type="email" data-scope="teacher" data-field="email" placeholder="usuario@colegio.edu.pe" value="${escapeAttribute(
            teacher.email
          )}" />
        </label>
        <label class="field compact-field">
          <span>Teléfono</span>
          <input type="tel" data-scope="teacher" data-field="phone" placeholder="987 654 321" value="${escapeAttribute(
            teacher.phone
          )}" />
        </label>
      </div>
    `;
  }

  function toggleRoleFields(activeRoleValue) {
    roleFieldBlocks.forEach((block) => {
      const matches = block.dataset.roleFields === activeRoleValue;
      block.hidden = !matches;
    });
  }

  function createEmptyStudentData() {
    return {
      grade: gradeOptions[0],
      section: '',
      status: statusOptions[0],
      tutor: ''
    };
  }

  function createEmptyTeacherData() {
    return {
      specialty: '',
      availability: availabilityOptions[0],
      email: '',
      phone: ''
    };
  }

  function resolveStatusClass(status) {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'regular') {
      return 'success';
    }
    if (normalized === 'evaluación') {
      return 'info';
    }
    if (normalized === 'traslado') {
      return 'danger';
    }
    if (normalized === 'pendiente') {
      return 'warning';
    }
    return 'info';
  }

  function resolveAvailabilityClass(availability) {
    const normalized = (availability || '').toLowerCase();
    if (normalized.includes('completo')) {
      return 'success';
    }
    if (normalized.includes('mañana')) {
      return 'info';
    }
    if (normalized.includes('tarde')) {
      return 'warning';
    }
    return 'info';
  }

  function createContactColumn(email, phone) {
    const safeEmail = (email || '').trim();
    const safePhone = (phone || '').trim();

    if (!safeEmail && !safePhone) {
      return '<span class="placeholder">Sin datos de contacto</span>';
    }

    if (!safeEmail) {
      return `<div class="contact-column"><span class="placeholder">Sin correo</span><small>${escapeHtml(
        safePhone
      )}</small></div>`;
    }

    return `<div class="contact-column"><a href="mailto:${escapeAttribute(
      safeEmail
    )}">${escapeHtml(safeEmail)}</a>${safePhone ? `<small>${escapeHtml(safePhone)}</small>` : ''}</div>`;
  }

  function escapeHtml(value) {
    return (value || '')
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function isAdminSectionAvailable(sectionId) {
    return adminNavButtons.some(
      (button) => !button.hidden && button.dataset.target === sectionId
    );
  }

  function activateAdminSection(target) {
    if (!target || !adminLayout) {
      return;
    }

    const panels = Array.from(adminLayout.querySelectorAll('.panel'));
    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === target);
    });

    adminNavButtons.forEach((button) => {
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
