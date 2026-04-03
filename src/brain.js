import { addHours, format, isPast, parseISO } from 'date-fns';

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

function setupForm() {
  const form = document.getElementById('add-item-form');
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

    // display as UI text; this can be adapted to append to list + state
    const mainCard = document.getElementById('main-card');
    if (mainCard) {
      mainCard.innerHTML = `
        <p>Task: ${title}</p>
        <p>Description: ${description}</p>
        <p>Due: ${friendlyDue}</p>
      `;
    }

    console.log('Added task', { title, description, dueDate: friendlyDue });

    // Optionally reset / keep defaults
    setDefaultDueDateTime();
    form.reset();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setDefaultDueDateTime();
  setupForm();
}); 
