// --- 1. DOM Element Node Selection ---
const taskListContainer = document.getElementById('task-list-container');
const taskForm = document.getElementById('task-form');
const taskCounter = document.getElementById('task-counter');
const modalOverlay = document.getElementById('modal-overlay');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');

// Initial Data mimicking the picture's content
let tasks = [
    { id: 1, title: 'Fitness', desc: 'Exercise and gym', time: '6:00 - 7:00', completed: true },
    { id: 2, title: 'Check Emails and sms', desc: 'Review and respond to messages', time: '7:30 - 8:00', completed: true },
    { id: 3, title: 'Attend Meeting', desc: 'Team meeting with HR', time: '10:00 - 11:00', completed: false }
];

// --- 2. Core Rendering Function (DOM Mutation Engine) ---
function renderTasks() {
    // Clearing previous elements
    taskListContainer.innerHTML = '';

    // Update Counter Text Node
    taskCounter.textContent = `${tasks.length} Tasks`;

    // Build out DOM tree structures for each individual task object
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.setAttribute('data-id', task.id);

        taskItem.innerHTML = `
                    <div class="task-time">${task.time}</div>
                    <div class="task-details">
                        <h4>${task.title}</h4>
                        <p>${task.desc}</p>
                    </div>
                    <label class="checkbox-container">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete(${task.id})">
                        <span class="checkmark"></span>
                    </label>
                    <button class="btn-delete" onclick="deleteTask(${task.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;

        taskListContainer.appendChild(taskItem);
    });
}

// --- 3. Event Handling Action Callbacks ---

// Open Slideout Drawer Input Form
btnOpenModal.addEventListener('click', () => {
    modalOverlay.classList.add('active');
});

// Close Slideout Drawer Input Form
btnCloseModal.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

// Intercepting and handling Form submission
taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents default browser reload behavior

    // Capturing individual data fields
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const time = document.getElementById('task-time').value;

    // Instantiating standard schema object structures
    const newTask = {
        id: Date.now(), // Generate semi-unique sequence identifiers
        title,
        desc,
        time,
        completed: false
    };

    tasks.push(newTask);
    renderTasks();

    // Clean interface layout elements and states
    taskForm.reset();
    modalOverlay.classList.remove('active');
});

// Mutating State and View Configurations for completion statuses
window.toggleTaskComplete = function (id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    renderTasks();
};

// Mutating State structures by removing items matching conditions
window.deleteTask = function (id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
};

// Initial Boot Loop Run Configuration execution
renderTasks();
