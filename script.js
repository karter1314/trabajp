document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginScreen = document.getElementById('login-screen');
  const teacherLayout = document.getElementById('teacher-layout');
  const studentLayout = document.getElementById('student-layout');
  const adminLayout = null;
  const sectionTitle = null;
  const subtitle = null;
  const adminNavButtons = [];
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
  const accessFeedback = document.getElementById('access-feedback');
  const downloadDirectoryButton = document.getElementById('download-directory');
  const gradeForm = document.getElementById('grade-form');
  const gradeCourseSelect = document.getElementById('grade-course');
  const gradeTableBody = document.getElementById('grade-table-body');
  const gradeFeedback = document.getElementById('grade-feedback');
  const gradeResetButton = document.getElementById('grade-reset');
  const gradeHistoryList = document.getElementById('grade-history');
  const gradeHistoryEmpty = document.getElementById('grade-history-empty');
  const teacherAssignmentForm = document.getElementById('teacher-assignment-form');
  const teacherAssignmentCourseSelect = document.getElementById('teacher-assignment-course');
  const teacherAssignmentTitle = document.getElementById('teacher-assignment-title');
  const teacherAssignmentDetail = document.getElementById('teacher-assignment-detail');
  const teacherAssignmentDue = document.getElementById('teacher-assignment-due');
  const teacherAssignmentFeedback = document.getElementById('teacher-assignment-feedback');
  const teacherAssignmentList = document.getElementById('teacher-assignment-list');
  const teacherAssignmentEmpty = document.getElementById('teacher-assignment-empty');
  const teacherAssignmentCount = document.getElementById('teacher-assignment-count');
  const teacherResourceForm = document.getElementById('teacher-resource-form');
  const teacherResourceCourseSelect = document.getElementById('teacher-resource-course');
  const teacherResourcePresentation = document.getElementById('teacher-resource-presentation');
  const teacherResourceVideo = document.getElementById('teacher-resource-video');
  const teacherResourceFeedback = document.getElementById('teacher-resource-feedback');
  const teacherResourceList = document.getElementById('teacher-resource-list');
  const teacherResourceEmpty = document.getElementById('teacher-resource-empty');
  const teacherResourceCount = document.getElementById('teacher-resource-count');
  const studentAssignmentList = document.getElementById('student-assignment-list');
  const studentAssignmentEmpty = document.getElementById('student-assignment-empty');
  const studentAssignmentSummary = document.getElementById('student-assignment-summary');
  const studentResourceList = document.getElementById('student-resource-list');
  const studentResourceEmpty = document.getElementById('student-resource-empty');
  const studentResourceSummary = document.getElementById('student-resource-summary');
  const PLATFORM_NAME = 'SESI';
  const STORAGE_KEY = 'sesiCredentials';
  const LEGACY_STORAGE_KEYS = ['siagiePlusCredentials', 'siseCredentials'];
  const WORKSPACE_STORAGE_KEY = 'sesiWorkspaceState';
  const LEGACY_WORKSPACE_KEYS = ['siagiePlusWorkspaceState', 'siseWorkspaceState'];
  const DIRECTORY_PATHS = {
    teacher: 'data/docentes.json',
    student: 'data/estudiantes.json'
  };
  const DIRECTORY_STORAGE_KEY = 'sesiDirectory';
  const LEGACY_DIRECTORY_STORAGE_KEYS = ['siagiePlusDirectory', 'siseDirectory'];
  const DIRECTORY_DOWNLOAD_NAME = 'directorio-sesi-actualizado.json';

  const storage = getStorage();
  migrateLegacyStorage();
  const body = document.body;

  document.title = `${PLATFORM_NAME} Plataforma Educativa`;

  document.querySelectorAll('[data-brand="name"]').forEach((element) => {
    element.textContent = PLATFORM_NAME;
  });

  const brandLabel = `Escudo institucional ${PLATFORM_NAME}`;
  document.querySelectorAll('[data-brand="logo"]').forEach((element) => {
    element.setAttribute('aria-label', brandLabel);
    element.setAttribute('title', brandLabel);
  });

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

  const DIRECTORY_ROLES = ['teacher', 'student'];

  const BASE_TEACHER_COUNT = document.querySelectorAll('#teachers-base tr').length;

  const teacherCourses = [
    {
      id: 'comunicacion-4b',
      name: 'Comunicación · 4.º Secundaria B',
      group: '4.º Secundaria B',
      room: 'Aula 204',
      students: [
        { id: 'andrea-paredes', name: 'Andrea Paredes', grade: 'AD' },
        { id: 'carlos-ramos', name: 'Carlos Ramos', grade: 'A' },
        { id: 'lucia-torres', name: 'Lucía Torres', grade: 'A' },
        { id: 'valeria-nunez', name: 'Valeria Núñez', grade: 'B' }
      ]
    },
    {
      id: 'matematicas-4b',
      name: 'Matemáticas · 4.º Secundaria B',
      group: '4.º Secundaria B',
      room: 'Aula 204',
      students: [
        { id: 'diego-herrera', name: 'Diego Herrera', grade: 'B' },
        { id: 'renato-ibanez', name: 'Renato Ibañez', grade: 'A' },
        { id: 'gabriel-lopez', name: 'Gabriel López', grade: 'B' },
        { id: 'ana-castro', name: 'Ana Castro', grade: 'A' }
      ]
    },
    {
      id: 'ciencias-4b',
      name: 'Ciencias · 4.º Secundaria B',
      group: '4.º Secundaria B',
      room: 'Laboratorio de ciencias',
      students: [
        { id: 'mariana-silva', name: 'Mariana Silva', grade: 'A' },
        { id: 'jorge-vizcarra', name: 'Jorge Vizcarra', grade: 'B' },
        { id: 'paula-gomez', name: 'Paula Gómez', grade: 'AD' },
        { id: 'sebastian-cortes', name: 'Sebastián Cortés', grade: 'A' }
      ]
    },
    {
      id: 'educacion-fisica-4b',
      name: 'Educación Física · 4.º Secundaria B',
      group: '4.º Secundaria B',
      room: 'Coliseo escolar',
      students: [
        { id: 'lucia-herrera', name: 'Lucía Herrera', grade: 'A' },
        { id: 'mateo-fernandez', name: 'Mateo Fernández', grade: 'B' },
        { id: 'ximena-alarcon', name: 'Ximena Alarcón', grade: 'A' },
        { id: 'raul-ordonez', name: 'Raúl Ordoñez', grade: 'AD' }
      ]
    }
  ];

  const gradeHistory = [];
  const assignments = [];
  const classResources = [];

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
    teacher: {
      heading: 'Acceso docente',
      description: 'Envía tareas y comparte recursos multimedia con tus aulas asignadas.',
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
      description: 'Revisa las tareas y accede a los videos o presentaciones compartidos.',
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
    teacher: [],
    student: []
  };

  const credentialsByRole = {
    teacher: { email: '', password: '' },
    student: { email: '', password: '' }
  };

  let activeRole = 'teacher';

  const newRecords = [];
  let recordIdCounter = 1;
  let directoryDownloadUrl = '';

  restoreSavedState();
  restoreWorkspaceState();
  ensureActiveRoleAvailable();
  updateRoleUI();
  populateCredentialsFields();
  setInitialView();
  initializeTeacherWorkspace();
  initializeStudentWorkspace();
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

    assignmentList?.addEventListener('change', (event) => handleAssignmentInteraction(event, true));
    assignmentList?.addEventListener('input', (event) => handleAssignmentInteraction(event, false));

    downloadDirectoryButton?.addEventListener('click', downloadDirectorySnapshot);

    gradeCourseSelect?.addEventListener('change', () => {
      renderGradeTable(gradeCourseSelect.value);
      clearGradeFeedback();
    });

    gradeResetButton?.addEventListener('click', () => {
      resetGradeSelections();
      clearGradeFeedback();
    });

    gradeForm?.addEventListener('submit', handleGradeFormSubmit);

    teacherAssignmentForm?.addEventListener('submit', handleTeacherAssignmentSubmit);
    teacherAssignmentForm?.addEventListener('input', () => {
      clearTeacherAssignmentFeedback();
    });
    teacherAssignmentCourseSelect?.addEventListener('change', () => {
      clearTeacherAssignmentFeedback();
    });

    teacherResourceForm?.addEventListener('submit', handleTeacherResourceSubmit);
    teacherResourceForm?.addEventListener('input', () => {
      clearTeacherResourceFeedback();
    });
    teacherResourceCourseSelect?.addEventListener('change', () => {
      clearTeacherResourceFeedback();
    });
    teacherResourcePresentation?.addEventListener('change', () => {
      clearTeacherResourceFeedback();
    });
    teacherResourceVideo?.addEventListener('change', () => {
      clearTeacherResourceFeedback();
    });

    studentAssignmentList?.addEventListener('click', handleStudentAssignmentClick);
  }

  async function loadAccessDirectory() {
    const storedDirectory = readStoredDirectory();
    if (storedDirectory) {
      applyDirectory(storedDirectory);
      populateCredentialsFields();
      persistState();
      return;
    }

    try {
      const [teacherResponse, studentResponse] = await Promise.all([
        fetch(DIRECTORY_PATHS.teacher, { cache: 'no-store' }),
        fetch(DIRECTORY_PATHS.student, { cache: 'no-store' })
      ]);

      if (!teacherResponse.ok || !studentResponse.ok) {
        throw new Error(
          `Estado inesperado: docentes ${teacherResponse.status} / estudiantes ${studentResponse.status}`
        );
      }

      const payload = {
        teacher: await teacherResponse.json(),
        student: await studentResponse.json()
      };

      applyDirectory(payload, { persist: true });
      populateCredentialsFields();
      persistState();
    } catch (error) {
      console.error('No se pudo cargar el padrón de usuarios.', error);
      showLoginFeedback(
        'No se pudo cargar el padrón de accesos. Verifica data/docentes.json y data/estudiantes.json.',
        'error'
      );
    }
  }

  function applyDirectory(payload, { persist = false, preferExisting = false } = {}) {
    invalidateDirectoryDownload();
    DIRECTORY_ROLES.forEach((role) => {
      const records = Array.isArray(payload?.[role]) ? payload[role] : [];
      accessDirectory[role] = records.map(normalizeAccount).filter((account) => account.email);

      if (!credentialsByRole[role]?.email && accessDirectory[role][0]) {
        credentialsByRole[role].email = accessDirectory[role][0].email;
      }

      if (accessDirectory[role][0]) {
        updateRoleMetadataFromAccount(role, accessDirectory[role][0], preferExisting);
      }
    });

    if (persist) {
      persistDirectory();
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
      const sourceFile = activeRole === 'teacher' ? 'data/docentes.json' : 'data/estudiantes.json';
      showLoginFeedback(
        `No hay cuentas registradas para este rol en la base de datos. Revisa ${sourceFile}.`,
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

  function showAccessFeedback(message, variant) {
    if (!accessFeedback) {
      return;
    }

    accessFeedback.textContent = message;
    accessFeedback.classList.remove('error', 'success');

    if (variant === 'error') {
      accessFeedback.classList.add('error');
    } else if (variant === 'success') {
      accessFeedback.classList.add('success');
    }
  }

  function clearAccessFeedback() {
    if (!accessFeedback) {
      return;
    }

    accessFeedback.textContent = '';
    accessFeedback.classList.remove('error', 'success');
  }

  function applyRoleProfile(role) {
    const metadata = roleMetadata[role];
    if (!metadata) {
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

      populateTeacherAssignmentCourses();
      renderTeacherAssignments();
      clearTeacherAssignmentFeedback();

      renderTeacherResources();
      clearTeacherResourceFeedback();

      clearGradeFeedback();

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

      renderStudentAssignments();
      updateStudentAssignmentSummary();
      renderStudentResources();
      updateStudentResourceSummary();
    }
  }

  function showLayoutForRole(role) {
    hideAllLayouts();
    const targetRole = role;

    if (targetRole === 'teacher' && teacherLayout) {
      teacherLayout.hidden = false;
      applyRoleProfile('teacher');
      return;
    }

    if (targetRole === 'student' && studentLayout) {
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
    populateGradeCourses();
    populateTeacherAssignmentCourses();
    clearGradeFeedback();
    clearTeacherAssignmentFeedback();
    clearTeacherResourceFeedback();
    updateGradeHistory();
    renderTeacherAssignments();
    renderTeacherResources();
  }

  function initializeStudentWorkspace() {
    renderStudentAssignments();
    renderStudentResources();
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

  function handleTeacherAssignmentSubmit(event) {
    event.preventDefault();

    if (!teacherAssignmentCourseSelect || !teacherAssignmentTitle) {
      return;
    }

    const courseId = teacherAssignmentCourseSelect.value;
    const title = teacherAssignmentTitle.value.trim();
    const detail = teacherAssignmentDetail?.value.trim() ?? '';
    const dueDate = teacherAssignmentDue?.value ?? '';

    if (!courseId || !title) {
      showTeacherAssignmentFeedback(
        'Selecciona un curso e indica un título para poder enviar la tarea.',
        'error'
      );
      return;
    }

    const course = teacherCourses.find((item) => item.id === courseId);
    const courseLabel = course?.name ?? 'Curso sin asignar';
    const courseGroup = course?.group ?? '';

    const assignment = {
      id: `assignment-${Date.now()}`,
      courseId,
      courseLabel,
      courseGroup,
      title,
      detail,
      dueDate,
      createdAt: new Date(),
      completed: false
    };

    assignments.unshift(assignment);

    if (assignments.length > 30) {
      assignments.pop();
    }

    teacherAssignmentForm?.reset();
    populateTeacherAssignmentCourses();
    if (teacherAssignmentCourseSelect) {
      teacherAssignmentCourseSelect.value = courseId;
    }

    showTeacherAssignmentFeedback(
      `La tarea para ${courseLabel} se envió correctamente.`,
      'success'
    );
    renderTeacherAssignments();
    renderStudentAssignments();
    persistWorkspaceState();
  }

  function renderTeacherAssignments() {
    if (!teacherAssignmentList || !teacherAssignmentEmpty) {
      return;
    }

    if (!assignments.length) {
      teacherAssignmentList.innerHTML = '';
      teacherAssignmentList.hidden = true;
      teacherAssignmentEmpty.hidden = false;
      updateTeacherAssignmentCount();
      return;
    }

    teacherAssignmentList.hidden = false;
    teacherAssignmentEmpty.hidden = true;

    const fragment = document.createDocumentFragment();

    assignments.forEach((assignment) => {
      const item = document.createElement('li');
      item.className = 'task-item assignment-item';
      item.dataset.assignmentId = assignment.id;

      const statusLabel = assignment.completed ? 'Marcada como completada' : 'Pendiente';
      const statusClass = assignment.completed ? 'success' : 'warning';

      const detailHtml = assignment.detail
        ? `<p>${escapeHtml(assignment.detail).replace(/\n/g, '<br />')}</p>`
        : '';

      const metaParts = [
        `Enviada: ${escapeHtml(formatDateTime(assignment.createdAt))}`
      ];
      if (assignment.courseGroup) {
        metaParts.push(`Sección: ${escapeHtml(assignment.courseGroup)}`);
      }
      if (assignment.dueDate) {
        metaParts.push(`Entrega: ${escapeHtml(formatDate(assignment.dueDate))}`);
      }
      item.innerHTML = `
        <div class="assignment-body">
          <div class="assignment-header">
            <strong>${escapeHtml(assignment.title)}</strong>
            <span class="chip">${escapeHtml(assignment.courseLabel)}</span>
          </div>
          ${detailHtml}
          <ul class="assignment-meta">
            ${metaParts.map((part) => `<li>${part}</li>`).join('')}
          </ul>
        </div>
        <div class="assignment-actions">
          <span class="chip ${statusClass}">${escapeHtml(statusLabel)}</span>
        </div>
      `;

      fragment.appendChild(item);
    });

    teacherAssignmentList.innerHTML = '';
    teacherAssignmentList.appendChild(fragment);
    updateTeacherAssignmentCount();
  }

  function renderStudentAssignments() {
    if (!studentAssignmentList || !studentAssignmentEmpty) {
      return;
    }

    if (!assignments.length) {
      studentAssignmentList.innerHTML = '';
      studentAssignmentList.hidden = true;
      studentAssignmentEmpty.hidden = false;
      updateStudentAssignmentSummary();
      return;
    }

    studentAssignmentList.hidden = false;
    studentAssignmentEmpty.hidden = true;

    const fragment = document.createDocumentFragment();

    assignments.forEach((assignment) => {
      const item = document.createElement('li');
      item.className = `task-item assignment-item${assignment.completed ? ' completed' : ''}`;
      item.dataset.assignmentId = assignment.id;

      const detailHtml = assignment.detail
        ? `<p>${escapeHtml(assignment.detail).replace(/\n/g, '<br />')}</p>`
        : '';

      const metaParts = [
        `Enviada el ${escapeHtml(formatDateTime(assignment.createdAt))}`
      ];
      if (assignment.dueDate) {
        metaParts.push(`Entrega: ${escapeHtml(formatDate(assignment.dueDate))}`);
      }
      if (assignment.courseGroup) {
        metaParts.push(`Sección: ${escapeHtml(assignment.courseGroup)}`);
      }
      item.innerHTML = `
        <div class="assignment-body">
          <div class="assignment-header">
            <strong>${escapeHtml(assignment.title)}</strong>
            <span class="chip">${escapeHtml(assignment.courseLabel)}</span>
          </div>
          ${detailHtml}
          <ul class="assignment-meta">
            ${metaParts.map((part) => `<li>${part}</li>`).join('')}
          </ul>
        </div>
        <div class="assignment-actions">
          <button type="button" class="secondary-button" data-action="toggle">
            ${escapeHtml(assignment.completed ? 'Marcar como pendiente' : 'Marcar como completada')}
          </button>
        </div>
      `;

      fragment.appendChild(item);
    });

    studentAssignmentList.innerHTML = '';
    studentAssignmentList.appendChild(fragment);
    updateStudentAssignmentSummary();
  }

  function handleStudentAssignmentClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.action !== 'toggle') {
      return;
    }

    const item = target.closest('.task-item');
    if (!item) {
      return;
    }

    const assignmentId = item.dataset.assignmentId;
    if (!assignmentId) {
      return;
    }

    const assignment = assignments.find((entry) => entry.id === assignmentId);
    if (!assignment) {
      return;
    }

    assignment.completed = !assignment.completed;
    renderStudentAssignments();
    renderTeacherAssignments();
    persistWorkspaceState();
  }

  function showTeacherAssignmentFeedback(message, status) {
    if (!teacherAssignmentFeedback) {
      return;
    }

    teacherAssignmentFeedback.textContent = message;
    teacherAssignmentFeedback.classList.remove('success', 'error');
    if (status) {
      teacherAssignmentFeedback.classList.add(status);
    }
  }

  function clearTeacherAssignmentFeedback() {
    if (!teacherAssignmentFeedback) {
      return;
    }

    teacherAssignmentFeedback.textContent = '';
    teacherAssignmentFeedback.classList.remove('success', 'error');
  }

  function populateTeacherAssignmentCourses() {
    const options = teacherCourses
      .map(
        (course) =>
          `<option value="${escapeAttribute(course.id)}">${escapeHtml(course.name)}</option>`
      )
      .join('');

    const availableCourses = teacherCourses.map((course) => course.id);

    if (teacherAssignmentCourseSelect) {
      teacherAssignmentCourseSelect.innerHTML = options;

      const currentValue = availableCourses.includes(teacherAssignmentCourseSelect.value)
        ? teacherAssignmentCourseSelect.value
        : availableCourses[0];

      if (currentValue) {
        teacherAssignmentCourseSelect.value = currentValue;
      }
    }

    if (teacherResourceCourseSelect) {
      teacherResourceCourseSelect.innerHTML = options;

      const currentValue = availableCourses.includes(teacherResourceCourseSelect.value)
        ? teacherResourceCourseSelect.value
        : availableCourses[0];

      if (currentValue) {
        teacherResourceCourseSelect.value = currentValue;
      }
    }
  }

  function updateTeacherAssignmentCount() {
    if (!teacherAssignmentCount) {
      return;
    }

    const total = assignments.length;
    const pending = assignments.filter((assignment) => !assignment.completed).length;

    teacherAssignmentCount.classList.remove('success', 'warning');

    if (!total) {
      teacherAssignmentCount.textContent = 'Sin tareas';
      return;
    }

    teacherAssignmentCount.textContent = `${total} ${total === 1 ? 'tarea' : 'tareas'}`;

    if (!pending) {
      teacherAssignmentCount.classList.add('success');
    } else {
      teacherAssignmentCount.classList.add('warning');
    }
  }

  function updateStudentAssignmentSummary() {
    if (!studentAssignmentSummary) {
      return;
    }

    const total = assignments.length;
    const pending = assignments.filter((assignment) => !assignment.completed).length;

    studentAssignmentSummary.classList.remove('success', 'warning');

    if (!total) {
      studentAssignmentSummary.textContent = 'Sin tareas';
      return;
    }

    if (!pending) {
      studentAssignmentSummary.textContent = 'Todo al día';
      studentAssignmentSummary.classList.add('success');
      return;
    }

    studentAssignmentSummary.textContent = `${pending} ${pending === 1 ? 'pendiente' : 'pendientes'}`;
    studentAssignmentSummary.classList.add('warning');
  }

  async function handleTeacherResourceSubmit(event) {
    event.preventDefault();

    if (!teacherResourceCourseSelect) {
      return;
    }

    const courseId = teacherResourceCourseSelect.value;
    const presentation = teacherResourcePresentation?.files?.[0] ?? null;
    const video = teacherResourceVideo?.files?.[0] ?? null;

    if (!courseId) {
      showTeacherResourceFeedback('Selecciona un curso para compartir el recurso.', 'error');
      return;
    }

    if (!presentation && !video) {
      showTeacherResourceFeedback('Adjunta una presentación o un video para compartir.', 'error');
      return;
    }

    const course = teacherCourses.find((item) => item.id === courseId);
    const [presentationUrl, videoUrl] = await Promise.all([
      presentation ? readFileAsDataUrl(presentation) : Promise.resolve(''),
      video ? readFileAsDataUrl(video) : Promise.resolve('')
    ]);

    const resource = {
      id: `resource-${Date.now()}`,
      courseId,
      courseLabel: course?.name ?? 'Curso sin asignar',
      courseGroup: course?.group ?? '',
      createdAt: new Date(),
      presentationName: presentation?.name ?? '',
      presentationUrl,
      videoName: video?.name ?? '',
      videoUrl
    };

    classResources.unshift(resource);

    if (classResources.length > 30) {
      const removed = classResources.pop();
      releaseResourceAssets(removed);
    }

    teacherResourceForm?.reset();
    if (teacherResourcePresentation) {
      teacherResourcePresentation.value = '';
    }
    if (teacherResourceVideo) {
      teacherResourceVideo.value = '';
    }

    showTeacherResourceFeedback(
      `Recurso compartido con ${resource.courseLabel}.`,
      'success'
    );
    renderTeacherResources();
    renderStudentResources();
    persistWorkspaceState();
  }

  function releaseResourceAssets(resource) {
    if (!resource) {
      return;
    }

    if (resource.presentationUrl && resource.presentationUrl.startsWith('blob:')) {
      URL.revokeObjectURL(resource.presentationUrl);
      resource.presentationUrl = '';
    }

    if (resource.videoUrl && resource.videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(resource.videoUrl);
      resource.videoUrl = '';
    }
  }

  function renderTeacherResources() {
    if (!teacherResourceList || !teacherResourceEmpty) {
      return;
    }

    if (!classResources.length) {
      teacherResourceList.innerHTML = '';
      teacherResourceList.hidden = true;
      teacherResourceEmpty.hidden = false;
      updateTeacherResourceCount();
      return;
    }

    teacherResourceList.hidden = false;
    teacherResourceEmpty.hidden = true;

    const fragment = document.createDocumentFragment();

    classResources.forEach((resource) => {
      const item = document.createElement('li');
      item.className = 'task-item assignment-item resource-item';

      const metaParts = [
        `Compartido el ${escapeHtml(formatDateTime(resource.createdAt))}`
      ];
      if (resource.courseGroup) {
        metaParts.push(`Sección: ${escapeHtml(resource.courseGroup)}`);
      }

      const actions = [];
      if (resource.presentationName && resource.presentationUrl) {
        actions.push(
          `<a class="ghost-button" href="${escapeAttribute(
            resource.presentationUrl
          )}" download="${escapeAttribute(resource.presentationName)}">Descargar presentación</a>`
        );
      }
      if (resource.videoUrl) {
        actions.push(
          `<a class="ghost-button" href="${escapeAttribute(
            resource.videoUrl
          )}" target="_blank" rel="noopener" download="${escapeAttribute(
            resource.videoName || 'video-clase.mp4'
          )}">Ver video</a>`
        );
      }

      item.innerHTML = `
        <div class="assignment-body">
          <div class="assignment-header">
            <strong>${escapeHtml(resource.courseLabel)}</strong>
            <span class="chip">Recurso</span>
          </div>
          <ul class="assignment-meta">
            ${metaParts.map((part) => `<li>${part}</li>`).join('')}
            ${
              resource.presentationName && resource.presentationUrl
                ? `<li>Presentación: <span>${escapeHtml(resource.presentationName)}</span></li>`
                : ''
            }
            ${
              resource.videoName && resource.videoUrl
                ? `<li>Video: <span>${escapeHtml(resource.videoName)}</span></li>`
                : ''
            }
          </ul>
        </div>
        <div class="assignment-actions">
          ${actions.join('') || '<span class="chip">Sin adjuntos</span>'}
        </div>
      `;

      fragment.appendChild(item);
    });

    teacherResourceList.innerHTML = '';
    teacherResourceList.appendChild(fragment);
    updateTeacherResourceCount();
  }

  function renderStudentResources() {
    if (!studentResourceList || !studentResourceEmpty) {
      return;
    }

    if (!classResources.length) {
      studentResourceList.innerHTML = '';
      studentResourceList.hidden = true;
      studentResourceEmpty.hidden = false;
      updateStudentResourceSummary();
      return;
    }

    studentResourceList.hidden = false;
    studentResourceEmpty.hidden = true;

    const fragment = document.createDocumentFragment();

    classResources.forEach((resource) => {
      const item = document.createElement('li');
      item.className = 'task-item assignment-item resource-item';

      const metaParts = [
        `Disponible desde ${escapeHtml(formatDateTime(resource.createdAt))}`
      ];
      if (resource.courseGroup) {
        metaParts.push(`Sección: ${escapeHtml(resource.courseGroup)}`);
      }

      const videoBlock = resource.videoUrl
        ? `<div class="assignment-video"><video controls preload="metadata" src="${escapeAttribute(
            resource.videoUrl
          )}"></video>${resource.videoName ? `<small>${escapeHtml(
            resource.videoName
          )}</small>` : ''}</div>`
        : '';

      item.innerHTML = `
        <div class="assignment-body">
          <div class="assignment-header">
            <strong>${escapeHtml(resource.courseLabel)}</strong>
            <span class="chip">Recurso</span>
          </div>
          ${videoBlock}
          <ul class="assignment-meta">
            ${metaParts.map((part) => `<li>${part}</li>`).join('')}
            ${
              resource.presentationName && resource.presentationUrl
                ? `<li>Presentación: <span>${escapeHtml(resource.presentationName)}</span></li>`
                : ''
            }
            ${
              resource.videoName && resource.videoUrl
                ? `<li>Video: <span>${escapeHtml(resource.videoName)}</span></li>`
                : ''
            }
          </ul>
        </div>
        <div class="assignment-actions">
          ${
            resource.presentationName && resource.presentationUrl
              ? `<a class="ghost-button" href="${escapeAttribute(
                  resource.presentationUrl
                )}" download="${escapeAttribute(resource.presentationName)}">Descargar presentación</a>`
              : ''
          }
          ${
            resource.videoUrl
              ? `<a class="ghost-button" href="${escapeAttribute(
                  resource.videoUrl
                )}" target="_blank" rel="noopener" download="${escapeAttribute(
                  resource.videoName || 'video-clase.mp4'
                )}">Abrir video</a>`
              : ''
          }
        </div>
      `;

      fragment.appendChild(item);
    });

    studentResourceList.innerHTML = '';
    studentResourceList.appendChild(fragment);
    updateStudentResourceSummary();
  }

  function showTeacherResourceFeedback(message, status) {
    if (!teacherResourceFeedback) {
      return;
    }

    teacherResourceFeedback.textContent = message;
    teacherResourceFeedback.classList.remove('success', 'error');
    if (status) {
      teacherResourceFeedback.classList.add(status);
    }
  }

  function clearTeacherResourceFeedback() {
    if (!teacherResourceFeedback) {
      return;
    }

    teacherResourceFeedback.textContent = '';
    teacherResourceFeedback.classList.remove('success', 'error');
  }

  function updateTeacherResourceCount() {
    if (!teacherResourceCount) {
      return;
    }

    const total = classResources.length;

    teacherResourceCount.classList.remove('success');

    if (!total) {
      teacherResourceCount.textContent = 'Sin recursos';
      return;
    }

    teacherResourceCount.textContent = `${total} ${total === 1 ? 'recurso' : 'recursos'}`;
    teacherResourceCount.classList.add('success');
  }

  function updateStudentResourceSummary() {
    if (!studentResourceSummary) {
      return;
    }

    const total = classResources.length;

    studentResourceSummary.classList.remove('success');

    if (!total) {
      studentResourceSummary.textContent = 'Sin recursos';
      return;
    }

    studentResourceSummary.textContent = `${total} ${total === 1 ? 'disponible' : 'disponibles'}`;
    studentResourceSummary.classList.add('success');
  }

  function formatDate(value) {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.valueOf())) {
      return '';
    }

    try {
      return new Intl.DateTimeFormat('es-PE', {
        dateStyle: 'medium'
      }).format(date);
    } catch (error) {
      return date.toLocaleDateString();
    }
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
    clearAccessFeedback();
    const fullName = (formData.get('fullName') || '').toString().trim();
    const identifier = (formData.get('identifier') || '').toString().trim();
    const selectedRole = (formData.get('role') || 'student').toString();
    const password = (formData.get('accessPassword') || '').toString().trim();

    const email = sanitizeEmail(
      selectedRole === 'student'
        ? (formData.get('studentEmail') || '').toString()
        : (formData.get('teacherEmail') || '').toString()
    );

    if (!fullName || !identifier) {
      showAccessFeedback('Completa el nombre y el identificador de la persona.', 'error');
      return;
    }

    if (!email) {
      showAccessFeedback('Ingresa un correo institucional válido.', 'error');
      return;
    }

    if (isEmailRegistered(email)) {
      showAccessFeedback('Ese correo ya existe en el padrón institucional.', 'error');
      return;
    }

    if (!password) {
      showAccessFeedback('Define una contraseña temporal para el acceso.', 'error');
      return;
    }

    const record = {
      id: recordIdCounter,
      name: fullName,
      identifier,
      role: selectedRole,
      credentials: {
        email,
        password
      },
      student: createEmptyStudentData(),
      teacher: createEmptyTeacherData()
    };

    if (selectedRole === 'student') {
      record.student = {
        grade: (formData.get('studentGrade') || gradeOptions[0]).toString(),
        section: (formData.get('studentSection') || '').toString().trim(),
        status: (formData.get('studentStatus') || statusOptions[0]).toString(),
        tutor: (formData.get('studentTutor') || '').toString().trim(),
        email
      };
    } else {
      record.teacher = {
        specialty: (formData.get('teacherSpecialty') || '').toString().trim(),
        availability: (formData.get('teacherAvailability') || availabilityOptions[0]).toString(),
        email,
        phone: (formData.get('teacherPhone') || '').toString().trim()
      };
    }

    newRecords.unshift(record);
    recordIdCounter += 1;
    syncRecordWithDirectory(record);
    renderRecords();

    accessForm.reset();
    if (accessRoleSelect) {
      accessRoleSelect.value = 'student';
    }
    toggleRoleFields('student');
    showAccessFeedback('Registro añadido y padrón actualizado.', 'success');
  }

  function handleAssignmentInteraction(event, shouldNotify = false) {
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

    const shouldPersist = event.type === 'change';

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
          record.student.email = record.credentials.email;
        } else {
          record.teacher = record.teacher || createEmptyTeacherData();
          if (!record.teacher.availability) {
            record.teacher.availability = availabilityOptions[0];
          }
          if (!record.teacher.email) {
            record.teacher.email = record.credentials.email;
          }
        }
        syncRecordWithDirectory(record, { persist: shouldPersist, notify: shouldNotify });
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
    } else if (scope === 'credentials') {
      record.credentials = record.credentials || { email: '', password: '' };
      const previousEmail = record.credentials.email;

      if (field === 'email') {
        record.credentials.email = target.value;
        const synced = syncRecordWithDirectory(record, {
          persist: shouldPersist,
          notify: shouldNotify,
          skipValidation: event.type === 'input'
        });

        if (!synced) {
          record.credentials.email = previousEmail;
          target.value = previousEmail;
          return;
        }
      } else if (field === 'password') {
        record.credentials.password = target.value;
        syncRecordWithDirectory(record, { persist: shouldPersist, notify: shouldNotify });
      }

      updateTables();
      updateCounters();
      return;
    }

    syncRecordWithDirectory(record, { persist: shouldPersist, notify: shouldNotify });
    updateTables();
    updateCounters();
  }

  function renderRecords() {
    updateAssignmentList();
    updateTables();
    updateCounters();
  }

  function syncRecordWithDirectory(
    record,
    { persist = true, notify = false, skipValidation = false } = {}
  ) {
    if (!record || !record.credentials) {
      return false;
    }

    const rawEmail = record.credentials.email ?? '';
    const email = sanitizeEmail(rawEmail);

    if (skipValidation) {
      record.credentials.email = email;
      if (record.role === 'student' && record.student) {
        record.student.email = email;
      } else if (record.role === 'teacher' && record.teacher && !record.teacher.email) {
        record.teacher.email = email;
      }
      return true;
    }

    if (!email) {
      if (notify) {
        showAccessFeedback('El correo institucional no puede quedar vacío.', 'error');
      }
      return false;
    }

    if (isEmailRegistered(email, record.directoryAccount)) {
      if (notify) {
        showAccessFeedback('Ese correo ya existe en el padrón institucional.', 'error');
      }
      return false;
    }

    record.credentials.email = email;

    const password = (record.credentials.password || '').toString().trim();
    record.credentials.password = password;

    if (record.role === 'student') {
      record.student = record.student || createEmptyStudentData();
      record.student.email = email;
    } else if (record.role === 'teacher') {
      record.teacher = record.teacher || createEmptyTeacherData();
      record.teacher.email = record.teacher.email || email;
    }

    const accountPayload = buildAccountFromRecord(record);
    const normalizedAccount = normalizeAccount(accountPayload);
    normalizedAccount.recordId = record.id;

    const previousAccount = record.directoryAccount;
    const previousRole = record.directoryRole;

    if (!previousAccount || previousRole !== record.role) {
      if (previousAccount && previousRole && accessDirectory[previousRole]) {
        const list = accessDirectory[previousRole];
        const index = list.indexOf(previousAccount);
        if (index >= 0) {
          list.splice(index, 1);
        }
      }

      accessDirectory[record.role] = accessDirectory[record.role] || [];
      accessDirectory[record.role].push(normalizedAccount);
      record.directoryAccount = normalizedAccount;
    } else {
      Object.assign(previousAccount, normalizedAccount);
      record.directoryAccount = previousAccount;
    }

    record.directoryRole = record.role;

    if (persist) {
      persistDirectory();
    } else {
      invalidateDirectoryDownload();
    }

    if (notify) {
      showAccessFeedback('Padrón actualizado correctamente.', 'success');
    }

    return true;
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
          const credentialEmail = record.credentials?.email || '';
          const contactEmail = teacher.email || credentialEmail;
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${escapeHtml(record.name)}</td>
            <td>${escapeHtml(teacher.specialty || 'Por definir')}</td>
            <td><span class="chip ${resolveAvailabilityClass(teacher.availability)}">${escapeHtml(
              teacher.availability || 'Por asignar'
            )}</span></td>
            <td>${createContactColumn(contactEmail, teacher.phone)}</td>
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
        ${renderCredentialFields(record)}
        ${renderRoleSpecificFields(record)}
      </div>
    `;

    return element;
  }

  function renderCredentialFields(record) {
    const credentials = record.credentials || { email: '', password: '' };
    return `
      <div class="assignment-fields">
        <label class="field compact-field">
          <span>Correo institucional</span>
          <input
            type="email"
            data-scope="credentials"
            data-field="email"
            placeholder="usuario@ie3058.edu.pe"
            value="${escapeAttribute(credentials.email)}"
          />
        </label>
        <label class="field compact-field">
          <span>Contraseña temporal</span>
          <input
            type="text"
            data-scope="credentials"
            data-field="password"
            placeholder="Contraseña inicial"
            value="${escapeAttribute(credentials.password)}"
          />
        </label>
      </div>
    `;
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
      tutor: '',
      email: ''
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

  function buildAccountFromRecord(record) {
    const email = sanitizeEmail(record.credentials?.email ?? '');
    const password = (record.credentials?.password ?? '').toString().trim();
    const name = record.name?.trim() || email;
    const detail =
      record.role === 'student'
        ? buildStudentDetail(record.student)
        : buildTeacherDetail(record.teacher);

    return {
      email,
      password,
      name,
      detail
    };
  }

  function buildStudentDetail(student) {
    if (!student) {
      return 'Estudiante';
    }

    const segments = [];
    const grade = (student.grade || '').toString().trim();
    if (grade) {
      segments.push(grade);
    }

    const section = (student.section || '').toString().trim();
    if (section) {
      segments.push(`Sección ${section}`);
    }

    const status = (student.status || '').toString().trim();
    if (status && status !== 'Regular') {
      segments.push(status);
    }

    const descriptor = segments.join(' · ');
    return descriptor ? `Estudiante ${descriptor}` : 'Estudiante';
  }

  function buildTeacherDetail(teacher) {
    if (!teacher) {
      return 'Docente';
    }

    const segments = [];
    const specialty = (teacher.specialty || '').toString().trim();
    if (specialty) {
      segments.push(specialty);
    }

    const availability = (teacher.availability || '').toString().trim();
    if (availability) {
      segments.push(availability);
    }

    const descriptor = segments.join(' · ');
    return descriptor ? `Docente ${descriptor}` : 'Docente';
  }

  function sanitizeEmail(value) {
    return (value || '').toString().trim();
  }

  function isEmailRegistered(email, excludedAccount = null) {
    if (!email) {
      return false;
    }

    const normalized = email.toLowerCase();
    return DIRECTORY_ROLES.some((role) =>
      (accessDirectory[role] || []).some(
        (account) => account.emailNormalized === normalized && account !== excludedAccount
      )
    );
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

  function migrateLegacyStorage() {
    if (!storage) {
      return;
    }

    try {
      if (!storage.getItem(STORAGE_KEY)) {
        for (const key of LEGACY_STORAGE_KEYS) {
          const legacyCredentials = storage.getItem(key);
          if (legacyCredentials) {
            storage.setItem(STORAGE_KEY, legacyCredentials);
            storage.removeItem(key);
            break;
          }
        }
      }
    } catch (error) {
      console.warn('No se pudieron migrar las credenciales guardadas.', error);
    }

    try {
      if (!storage.getItem(DIRECTORY_STORAGE_KEY)) {
        for (const key of LEGACY_DIRECTORY_STORAGE_KEYS) {
          const legacyDirectory = storage.getItem(key);
          if (legacyDirectory) {
            storage.setItem(DIRECTORY_STORAGE_KEY, legacyDirectory);
            storage.removeItem(key);
            break;
          }
        }
      }
    } catch (error) {
      console.warn('No se pudo migrar el padrón institucional guardado.', error);
    }
  }

  function restoreWorkspaceState() {
    if (!storage) {
      return;
    }

    const raw = readWorkspaceSnapshot();
    if (!raw) {
      return;
    }

    assignments.length = 0;
    classResources.length = 0;

    const savedAssignments = Array.isArray(raw.assignments) ? raw.assignments : [];
    savedAssignments.forEach((entry) => {
      assignments.push({
        id: entry.id || `assignment-${Date.now()}`,
        courseId: entry.courseId || '',
        courseLabel: entry.courseLabel || 'Curso sin asignar',
        courseGroup: entry.courseGroup || '',
        title: entry.title || 'Tarea',
        detail: entry.detail || '',
        dueDate: entry.dueDate || '',
        createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
        completed: Boolean(entry.completed)
      });
    });

    const savedResources = Array.isArray(raw.resources) ? raw.resources : [];
    savedResources.forEach((entry) => {
      classResources.push({
        id: entry.id || `resource-${Date.now()}`,
        courseId: entry.courseId || '',
        courseLabel: entry.courseLabel || 'Curso sin asignar',
        courseGroup: entry.courseGroup || '',
        createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
        presentationName: entry.presentationName || '',
        presentationUrl: entry.presentationUrl || '',
        videoName: entry.videoName || '',
        videoUrl: entry.videoUrl || ''
      });
    });
  }

  function persistWorkspaceState() {
    if (!storage) {
      return;
    }

    const snapshot = {
      assignments: assignments.map((assignment) => ({
        id: assignment.id,
        courseId: assignment.courseId,
        courseLabel: assignment.courseLabel,
        courseGroup: assignment.courseGroup,
        title: assignment.title,
        detail: assignment.detail,
        dueDate: assignment.dueDate,
        createdAt: assignment.createdAt instanceof Date ? assignment.createdAt.toISOString() : '',
        completed: Boolean(assignment.completed)
      })),
      resources: classResources.map((resource) => ({
        id: resource.id,
        courseId: resource.courseId,
        courseLabel: resource.courseLabel,
        courseGroup: resource.courseGroup,
        createdAt: resource.createdAt instanceof Date ? resource.createdAt.toISOString() : '',
        presentationName: resource.presentationName,
        presentationUrl: resource.presentationUrl,
        videoName: resource.videoName,
        videoUrl: resource.videoUrl
      }))
    };

    try {
      storage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.warn('No se pudo guardar el estado del aula.', error);
    }
  }

  function readWorkspaceSnapshot() {
    const candidates = [WORKSPACE_STORAGE_KEY, ...LEGACY_WORKSPACE_KEYS];

    for (const key of candidates) {
      try {
        const raw = storage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (error) {
        console.warn('No se pudo leer el estado del aula.', error);
      }
    }

    return null;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = () => reject(reader.error || new Error('No se pudo leer el archivo'));
      reader.readAsDataURL(file);
    });
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

  function persistDirectory() {
    invalidateDirectoryDownload();

    if (!storage) {
      return;
    }

    try {
      const snapshot = buildDirectorySnapshot();
      storage.setItem(DIRECTORY_STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.error('No se pudo guardar el padrón institucional.', error);
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

  function ensureActiveRoleAvailable() {
    const hasMatchingTab = Array.from(roleTabs).some(
      (tab) => tab.dataset.role === activeRole
    );

    if (!hasMatchingTab) {
      activeRole = 'teacher';
    }
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

  function readStoredDirectory() {
    if (!storage) {
      return null;
    }

    try {
      const raw = storage.getItem(DIRECTORY_STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn('No se pudo leer el padrón institucional almacenado.', error);
      return null;
    }
  }

  function buildDirectorySnapshot() {
    const snapshot = {};
    DIRECTORY_ROLES.forEach((role) => {
      snapshot[role] = (accessDirectory[role] || []).map((account) => ({
        email: account.email,
        password: account.password ?? '',
        name: account.name ?? '',
        detail: account.detail ?? ''
      }));
    });
    return snapshot;
  }

  function invalidateDirectoryDownload() {
    if (directoryDownloadUrl) {
      URL.revokeObjectURL(directoryDownloadUrl);
      directoryDownloadUrl = '';
    }
  }

  function downloadDirectorySnapshot() {
    try {
      const snapshot = buildDirectorySnapshot();
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      invalidateDirectoryDownload();
      directoryDownloadUrl = URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = directoryDownloadUrl;
      anchor.download = DIRECTORY_DOWNLOAD_NAME;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      showAccessFeedback('Se descargó el padrón actualizado.', 'success');
    } catch (error) {
      console.error('No se pudo preparar la descarga del padrón.', error);
      showAccessFeedback('No se pudo generar la descarga del padrón.', 'error');
    }
  }

  function getStorage() {
    try {
      if (typeof window === 'undefined' || !('localStorage' in window)) {
        return null;
      }

      const testKey = '__sesi-test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch (error) {
      console.warn('El almacenamiento local no está disponible.', error);
      return null;
    }
  }

  window.addEventListener('beforeunload', () => {
    assignments.forEach((assignment) => {
      if (assignment.fileUrl) {
        URL.revokeObjectURL(assignment.fileUrl);
      }
    });
    invalidateDirectoryDownload();
  });
});
