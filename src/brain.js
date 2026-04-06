import { addHours, format, isPast, parseISO } from 'date-fns';

const state = {
  tasks: [],
  sortMode: '',
};

function seedDefaultTasks() {
  if (state.tasks.length > 0) return;

  const now = new Date();
  const firstDeadline = format(addHours(now, 24), "yyyy-MM-dd'T'HH:mm");
  const secondDeadline = format(addHours(now, 48), "yyyy-MM-dd'T'HH:mm");

  state.tasks = [
    {
      id: createTaskId(),
      title: 'Set up weekly goals',
      description: 'Outline priorities for this week.',
      deadlineIso: firstDeadline,
      completed: false,
    },
    {
      id: createTaskId(),
      title: 'Review project notes',
      description: 'Read notes and prepare next actions.',
      deadlineIso: secondDeadline,
      completed: false,
    },
  ];
}

function setDefaultDueDateTime() {
  const dueDateInput = document.getElementById('DueDate');
  const dueTimeInput = document.getElementById('DueTime');
  const now = new Date();

  if (dueDateInput) {
    dueDateInput.value = format(now, 'yyyy-MM-dd');
  }

  if (dueTimeInput) {
    const oneHourLater = addHours(now, 1);
    dueTimeInput.value = format(oneHourLater, 'HH:mm');
  }
}

function displayForm() {
  const overlay = document.getElementById('blur-background');
  const openBtn = document.getElementById('add-newp');
  const closeBtn = document.getElementById('close-form-btn');
  const titleInput = document.getElementById('Title');

  if (!overlay || !openBtn) {
    return {
      closeForm: () => {},
    };
  }

  const openForm = () => {
    overlay.classList.add('open');
    setDefaultDueDateTime();
    titleInput?.focus();
  };

  const closeForm = () => {
    overlay.classList.remove('open');
  };

  openBtn.addEventListener('click', openForm);
  closeBtn?.addEventListener('click', closeForm);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeForm();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeForm();
    }
  });

  return { closeForm };
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isTaskOverdue(task) {
  if (task.completed) return false;
  return isPast(parseISO(task.deadlineIso));
}

function getSortedTasks() {
  const tasks = [...state.tasks];

  if (state.sortMode === 'Sort-Due-Date') {
    tasks.sort((a, b) => parseISO(a.deadlineIso) - parseISO(b.deadlineIso));
  } else if (state.sortMode === 'Sort-Title') {
    tasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  return tasks;
}

function createTaskId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function updateMetrics() {
  const total = state.tasks.length;
  const completed = state.tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const overdue = state.tasks.filter((task) => isTaskOverdue(task)).length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const totalNode = document.getElementById('metric-total');
  const completedNode = document.getElementById('metric-completed');
  const pendingNode = document.getElementById('metric-pending');
  const overdueNode = document.getElementById('metric-overdue');
  const rateNode = document.getElementById('metric-rate');

  if (totalNode) totalNode.textContent = String(total);
  if (completedNode) completedNode.textContent = String(completed);
  if (pendingNode) pendingNode.textContent = String(pending);
  if (overdueNode) overdueNode.textContent = String(overdue);
  if (rateNode) rateNode.textContent = `${completionRate}%`;
}

function renderTasks() {
  const list = document.getElementById('to-do-list');
  if (!list) return;

  const tasks = getSortedTasks();

  if (tasks.length === 0) {
    list.innerHTML = '<li class="empty-state">No tasks yet. Add your first project.</li>';
    updateMetrics();
    return;
  }

  list.innerHTML = tasks
    .map((task) => {
      const friendlyDue = format(parseISO(task.deadlineIso), 'MMMM d, yyyy HH:mm');
      const safeDescription = task.description
        ? `<p class="todo-description">${escapeHtml(task.description)}</p>`
        : '<p class="todo-description muted">No description</p>';
      const overdueClass = isTaskOverdue(task) ? 'overdue' : '';
      const completedClass = task.completed ? 'completed' : '';
      const duePrefix = isTaskOverdue(task) ? 'Overdue since' : 'Due';

      return `
        <li class="todo-item ${overdueClass} ${completedClass}" data-task-id="${task.id}">
          <div class="todo-header">
            <p class="todo-title">${escapeHtml(task.title)}</p>
            <span class="todo-status">${task.completed ? 'Completed' : 'Open'}</span>
          </div>
          ${safeDescription}
          <p class="todo-meta">${duePrefix}: ${friendlyDue}</p>
          <div class="task-actions">
            <button type="button" data-action="toggle-complete" class="complete-btn">${task.completed ? 'Mark Open' : 'Mark Done'}</button>
            <button type="button" data-action="delete-task" class="delete-btn">Delete</button>
          </div>
        </li>
      `;
    })
    .join('');

  updateMetrics();
}

function setupTaskActions() {
  const list = document.getElementById('to-do-list');
  if (!list) return;

  list.addEventListener('click', (event) => {
    const actionBtn = event.target.closest('button[data-action]');
    if (!actionBtn) return;

    const taskNode = actionBtn.closest('[data-task-id]');
    const taskId = taskNode?.getAttribute('data-task-id');
    if (!taskId) return;

    if (actionBtn.dataset.action === 'toggle-complete') {
      const task = state.tasks.find((item) => item.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    }

    if (actionBtn.dataset.action === 'delete-task') {
      state.tasks = state.tasks.filter((item) => item.id !== taskId);
    }

    renderTasks();
  });

  const deleteAllBtn = document.getElementById('delete-all-btn');
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', () => {
      if (state.tasks.length === 0) return;
      state.tasks = [];
      renderTasks();
    });
  }

  const sortSelect = document.getElementById('project-filter');
  if (sortSelect) {
    sortSelect.addEventListener('change', (event) => {
      state.sortMode = event.target.value;
      renderTasks();
    });
  }
}

function setupForm(closeForm) {
  const form = document.getElementById('add-project-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('Title')?.value?.trim() || 'Untitled';
    const description = document.getElementById('Description')?.value?.trim() || '';
    const dueDateValue = document.getElementById('DueDate')?.value;
    const dueTimeValue = document.getElementById('DueTime')?.value;

    if (!dueDateValue || !dueTimeValue) {
      alert('Please choose due date and time.');
      return;
    }

    const deadlineIso = `${dueDateValue}T${dueTimeValue}`;
    const dueDate = parseISO(deadlineIso);

    if (isPast(dueDate)) {
      alert('Due date/time cannot be in the past');
      return;
    }

    const friendlyDue = format(dueDate, 'MMMM d, yyyy HH:mm');

    state.tasks.push({
      id: createTaskId(),
      title,
      description,
      deadlineIso,
      completed: false,
    });

    renderTasks();

    console.log('Added task', { title, description, dueDate: friendlyDue });

    form.reset();
    setDefaultDueDateTime();
    closeForm();
  });
}

function toggleSidebar() {
  const navBtn = document.getElementById('nav');
  const sidebar = document.getElementById('menu');
  const backdrop = document.getElementById('menu-backdrop');
  const menuLinks = sidebar?.querySelectorAll('.menu-item') || [];

  if (!navBtn || !sidebar || !backdrop) return;

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  };

  navBtn.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    backdrop.classList.toggle('open', isOpen);
  });

  backdrop.addEventListener('click', closeSidebar);

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeSidebar);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSidebar();
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setDefaultDueDateTime();
  const { closeForm } = displayForm();
  setupForm(closeForm);
  setupTaskActions();
  seedDefaultTasks();
  renderTasks();
  toggleSidebar();
});

