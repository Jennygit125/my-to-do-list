import { parseISO } from 'date-fns';

export function isTaskOverdue(task, now = new Date()) {
  if (task.completed) return false;

  const deadline = parseISO(task.deadlineIso);
  if (Number.isNaN(deadline.getTime())) return false;

  return deadline < now;
}

export function sortTasks(tasks, sortMode = '') {
  const sorted = [...tasks];

  if (sortMode === 'Sort-Due-Date') {
    sorted.sort((a, b) => parseISO(a.deadlineIso) - parseISO(b.deadlineIso));
  } else if (sortMode === 'Sort-Title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sorted;
}

export function calculateMetrics(tasks, now = new Date()) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter((task) => isTaskOverdue(task, now)).length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate,
  };
}
