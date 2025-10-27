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
  const accessForm = document.getElementById('access-form');
  const accessRoleSelect = document.getElementById('access-role');
  const roleFieldBlocks = document.querySelectorAll('[data-role-fields]');
  const assignmentList = document.getElementById('assignment-list');
  const noRecordsMessage = document.getElementById('no-records');
  const pendingCount = document.getElementById('pending-count');
  const studentsDynamicBody = document.getElementById('students-dynamic');
  const teachersDynamicBody = document.getElementById('teachers-dynamic');
  const teacherCount = document.getElementById('teacher-count');
  const STORAGE_KEY = 'siagiePlusCredentials';

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

  const availabilityOptions = [
    'Turno completo',
    'Turno mañana',
    'Turno tarde',
    'Horas parciales'
  ];

  const BASE_TEACHER_COUNT = document.querySelectorAll('#teachers-base tr').length;

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

  const newRecords = [];
  let recordIdCounter = 1;

  restoreSavedState();
  updateRoleUI();
  populateCredentialsFields();
  setInitialView();
  attachEventHandlers();
  toggleRoleFields(accessRoleSelect?.value ?? 'student');
  updateCounters();

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

    accessRoleSelect?.addEventListener('change', () => {
      toggleRoleFields(accessRoleSelect.value);
    });

    accessForm?.addEventListener('submit', handleAccessFormSubmit);

    assignmentList?.addEventListener('change', handleAssignmentInteraction);
    assignmentList?.addEventListener('input', handleAssignmentInteraction);
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
