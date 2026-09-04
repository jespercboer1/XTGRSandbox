const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

const titleInput = document.getElementById('titleInput');
const dueDateInput = document.getElementById('dueDateInput');
const timeInput = document.getElementById('timeInput');
const descriptionInput = document.getElementById('descriptionInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<li>No tasks yet.</li>';
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <strong>${index + 1}.</strong>
            <span class="task-title">${task.title}</span>
            ${task.dueDate ? `<span class="task-due">(due ${task.dueDate}${task.time ? ' ' + task.time : ''})</span>` : ''}
            ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
        `;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function addTask() {
    const title = titleInput.value.trim();
    const dueDate = dueDateInput.value;
    const time = timeInput.value;
    const description = descriptionInput.value.trim();

    if (!title) {
        alert('Please enter a title.');
        titleInput.focus();
        return;
    }

    tasks.push({ title, dueDate, time, description });
    saveTasks();
    renderTasks();

    titleInput.value = '';
    dueDateInput.value = '';
    timeInput.value = '';
    descriptionInput.value = '';
    titleInput.focus();
}

addBtn.addEventListener('click', addTask);

titleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

dueDateInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

renderTasks();