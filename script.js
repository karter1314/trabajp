document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginScreen = document.getElementById('login-screen');
  const mainLayout = document.getElementById('main-layout');
  const sectionTitle = document.getElementById('section-title');
  const subtitle = document.querySelector('.subtitle');
  const navButtons = document.querySelectorAll('.nav-item');
  const logoutButton = document.getElementById('logout-button');
  const modals = document.querySelectorAll('.modal');
  const openModalButtons = document.querySelectorAll('[data-modal]');
  const teacherTableBody = document.getElementById('teacher-table-body');
  const teacherEmptyState = document.getElementById('teacher-empty-state');
  const teacherCountBadge = document.getElementById('teacher-count');
  const toast = document.getElementById('toast');

  const availabilityStyles = {
    'Turno mañana': 'info',
    'Turno tarde': 'warning',
    'Turno completo': 'success'
  };

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

  let toastTimeoutId;

  const body = document.body;

  setInitialView();
  attachEventHandlers();
  updateTeacherCount();

  function setInitialView() {
    if (loginScreen) {
      loginScreen.hidden = false;
    }

    if (mainLayout) {
      mainLayout.hidden = true;
    }

    modals.forEach((modal) => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
    });

    body.classList.remove('modal-open');
    body.style.alignItems = 'center';
    body.style.justifyContent = 'center';
  }

  function attachEventHandlers() {
    loginForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      setAuthenticatedState(true);
    });

    logoutButton?.addEventListener('click', () => {
      closeAllModals();
      setAuthenticatedState(false);
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

    openModalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modalId = button.dataset.modal;
        const modal = modalId ? document.getElementById(modalId) : null;
        openModal(modal);
      });
    });

    document.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) return;

      const closeTrigger = event.target.closest('[data-close]');
      if (closeTrigger) {
        event.preventDefault();
        const modal = closeTrigger.closest('.modal');
        closeModal(modal);
        return;
      }

      if (event.target.classList.contains('modal')) {
        closeModal(event.target);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const modal = getFirstOpenModal();
        closeModal(modal);
      }
    });

    modals.forEach((modal) => {
      modal.querySelectorAll('form').forEach((form) => {
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const formType = form.dataset.form;
          const handler = formType ? formHandlers[formType] : null;
          const shouldClose = handler ? handler(new FormData(form), form) !== false : true;
          if (shouldClose) {
            closeModal(modal);
          }
        });
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

  function areAnyModalsOpen() {
    return Array.from(modals).some((modal) => !modal.hidden);
  }

  function getFirstOpenModal() {
    return Array.from(modals).find((modal) => !modal.hidden);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    const firstInput = modal.querySelector('form input, form select, form textarea');
    if (firstInput instanceof HTMLElement) {
      firstInput.focus();
    }
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.querySelectorAll('form').forEach((form) => form.reset());
    if (!areAnyModalsOpen()) {
      body.classList.remove('modal-open');
    }
  }

  function closeAllModals() {
    modals.forEach((modal) => closeModal(modal));
  }

  const formHandlers = {
    teacher(formData) {
      const teacher = {
        name: formData.get('name')?.toString().trim(),
        specialty: formData.get('specialty')?.toString().trim(),
        phone: formData.get('phone')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        availability: formData.get('availability')?.toString()
      };

      if (!teacher.name || !teacher.specialty || !teacher.phone || !teacher.email || !teacher.availability) {
        return false;
      }

      addTeacherRow(teacher);
      showToast(`Docente ${teacher.name} registrado correctamente.`);
      return true;
    }
  };

  function addTeacherRow(teacher) {
    if (!teacherTableBody) return;

    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = teacher.name;

    const specialtyCell = document.createElement('td');
    specialtyCell.textContent = teacher.specialty;

    const availabilityCell = document.createElement('td');
    const chip = document.createElement('span');
    const availabilityClass = availabilityStyles[teacher.availability] ?? 'info';
    chip.className = `chip ${availabilityClass}`;
    chip.textContent = teacher.availability;
    availabilityCell.appendChild(chip);

    const contactCell = document.createElement('td');
    const contactWrapper = document.createElement('div');
    contactWrapper.className = 'contact-column';

    const emailLink = document.createElement('a');
    emailLink.href = `mailto:${teacher.email}`;
    emailLink.textContent = teacher.email;

    const phoneText = document.createElement('small');
    phoneText.textContent = teacher.phone;

    contactWrapper.append(emailLink, phoneText);
    contactCell.appendChild(contactWrapper);

    row.append(nameCell, specialtyCell, availabilityCell, contactCell);
    teacherTableBody.appendChild(row);

    if (teacherEmptyState) {
      teacherEmptyState.hidden = true;
    }

    updateTeacherCount();
  }

  function updateTeacherCount() {
    if (teacherCountBadge && teacherTableBody) {
      const total = teacherTableBody.children.length;
      teacherCountBadge.textContent = total === 1 ? '1 docente' : `${total} docentes`;
    }

    if (teacherEmptyState && teacherTableBody) {
      teacherEmptyState.hidden = teacherTableBody.children.length > 0;
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add('show');
    clearTimeout(toastTimeoutId);
    toastTimeoutId = window.setTimeout(() => {
      toast.classList.remove('show');
      toastTimeoutId = window.setTimeout(() => {
        toast.hidden = true;
      }, 320);
    }, 2800);
  }
});
