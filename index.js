const form = document.querySelector('.form');
const taskContainer = document.getElementById('tasks-container');
const taskTemplate = document.getElementById('tasks-template');
const taskDescription = document.getElementById('input-task');
const dueDate = document.getElementById('input-date');
const footer = document.querySelector('#footer');
let taskId = 0;
let tasks = [];

const checkOverdue = () => {
    const nowDate = new Date();
    const dateStr =  dueDate.value;
    const dateParts = dateStr.split('-');
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return date < nowDate;
};

const createTask = () => {
    const overdue = checkOverdue();
    const newTask = {
        'id': taskId++,
        'description': taskDescription.value,
        'dueDate': dueDate.value,
        'overdue': overdue,
        'complete': false,
    };
    tasks.push(newTask);
    saveTask();
};

const saveTask = () => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    showTasks();
};

const showTasks = () => {
    taskContainer.innerHTML = '';
    if (tasks.length === 0) {
        footer.innerHTML = `<th colspan='5'>There is no tasks to do!!</th>`;
        return;
    }
    tasks.forEach(element => {
        if (element !== null) {
            footer.innerHTML = '';
            const taskItem = taskTemplate.content.cloneNode(true);
            const taskStatus = taskItem.querySelector('#task-status');
            const taskRow = taskItem.querySelector('#task-row');
            const taskDate = taskItem.querySelector('#task-date');
            const trashIcon = taskItem.querySelector('.fa-trash');

            if (element.overdue && !element.complete) {
                taskDate.classList.add('overdue-task');
            }
            
            if (element.complete) {
                taskStatus.className = 'fa-solid fa-rotate';
                taskRow.classList.toggle('active');
            } else {
                taskStatus.className = 'fa-solid fa-check';
            }

            taskItem.querySelector('#task-Id').textContent = element.id;
            taskItem.querySelector('#task-description').textContent = element.description;
            taskDate.textContent = element.dueDate;
            taskStatus.dataset.id = element.id;
            trashIcon.dataset.id = element.id;

            taskContainer.appendChild(taskItem);
        }
    });
};

const handleTaskClick = (event) => {
    const taskId = event.target.dataset.id;
    const taskIndex = tasks.findIndex((ele)=> ele.id === parseInt(taskId));
    if (event.target.classList.contains('fa-trash')) {
        if (event.target.hasAttribute('data-id')) {
            if(confirm("Are you sure you want to delete this task?")){
                tasks = tasks.filter((ele)=> ele.id != taskId);
                saveTask();
            }
        }
    } else if (event.target.classList.contains('fa-check')) {
        tasks[taskIndex].complete = true;
        saveTask();
    } else if (event.target.classList.contains('fa-rotate')) {
        tasks[taskIndex].complete = false;
        saveTask();
    }
    event.stopPropagation();
};

taskContainer.addEventListener('click', handleTaskClick);

form.addEventListener('submit', (event) => {
    createTask();
    taskDescription.value = '';
    dueDate.value = '';
    event.preventDefault();
});

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('todoTasks')){
        tasks = JSON.parse(localStorage.getItem('todoTasks'));
        taskId = tasks.length;
        showTasks();
    }
    showTasks();
});
