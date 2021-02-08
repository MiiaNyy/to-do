import {
    TodoItem
} from "./classes";

import {
    displayNewTask,
    getFormatedDate,
} from "./dom";

import add from 'date-fns/add'

let taskForm = document.querySelector('.task-form');
let taskContainer = document.querySelector('.tasks-container');

let tasks = [];


function editOldTask(form, id) {
    let data = new FormData(form);
    let obj = getValuesFromTaskForm(data, id, 'edit');
    displayEditedTask(id, obj);
    saveTasksToStorage();
}

function makeNewTask(form) {
    let data = new FormData(form);
    let newTask = getValuesFromTaskForm(data, null, 'addNew');
    displayNewTask(newTask);
    tasks.push(newTask);
    saveTasksToStorage();
}


function displayAllTasksInHomeScreen() {
    displayProjectHeader(null, 'home');
    for (let i = 0; i < tasks.length; i++) {
        displayNewTask(tasks[i]);
    }
}


//When user wants to edit already existing task. Open obj values in the form.
function openFormWithObjValues(event) {
    let eleParent = event.target.parentNode;
    let targetElementId = eleParent.parentNode.id;
    let formElements = taskForm.elements;
    let taskId;

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (task.id == targetElementId) {

            taskId = task.id;
            for (let j = 0; j < formElements.length; j++) {
                let eleName = formElements[j].name;
                switch (eleName) {
                    case 'task-name':
                        formElements[j].value = task.name;
                        break;
                    case 'select-project':
                        console.log('tasks project is ' + task.project);
                        formElements[j].value = task.project.toLowerCase();
                        break;
                    case 'dueDate':
                        formElements[j].value = task.dueDate;
                        break;
                    case 'time':
                        formElements[j].value = task.dueTime;
                        break;
                    case 'task-priority':
                        if (formElements[j].id == task.priority) {
                            formElements[j].checked = true;
                        }
                        break;
                    case 'task-notes':
                        formElements[j].value = task.notes;
                        break;
                }
            }
        }
    }
    return taskId;
}

//When user has inputed info about the task, or has edited old task, make return taks obj
function getValuesFromTaskForm(data, id, submitType) {
    let obj = {}

    for (const entry of data) {

        switch (entry[0]) {
            case 'task-name':
                obj.name = entry[1];
                break;
            case 'select-project':
                obj.project = entry[1];
                break;
            case 'dueDate':
                obj.dueDate = entry[1];
                break;
            case 'time':
                obj.dueTime = entry[1];
                break;
            case 'task-priority':
                obj.priority = entry[1];
                break;
            case 'task-notes':
                obj.notes = entry[1];
                break;
        }
    }
    if (submitType == 'edit') {
        return changeTaskObjValues(id, obj.name, obj.project, obj.dueDate, obj.dueTime, obj.priority, obj.notes);
    } else if (submitType == 'addNew') {
        return new TodoItem(obj.name, obj.dueDate, obj.dueTime, obj.project, obj.priority, obj.notes);
    }
}

//When user is ready to submit edited values to the task, this changes the right task obj
function changeTaskObjValues(id, name, project, duedate, duetime, priority, notes) {
    let obj;
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        //By comparing elements id to the obj.id we find the right obj
        if (task.id == id) {
            obj = task;
            task.name = name;
            task.project = project;
            task.dueDate = duedate;
            task.dueTime = duetime;
            task.priority = priority;
            task.notes = notes;
        }
    }
    return obj;
}

//Changes the screen view, that edited task values show
function displayEditedTask(id, obj) {
    let element = document.getElementById(id);
    let childElements = element.children;
    let date = getFormatedDate(obj.dueDate)

    for (let i = 0; i < childElements.length; i++) {
        const e = childElements[i];
        //elements class name list
        const eClassNames = e.classList;

        for (let j = 0; j < eClassNames.length; j++) {
            switch (eClassNames[j]) {
                case 'task-name':
                    e.innerHTML = obj.name;
                    break;
                case 'due-date':
                    e.innerHTML = date;
                    break;
                case 'due-time':
                    e.innerHTML = obj.dueTime;
                    break;
                case 'color-code':
                    //Because class name priority is always on the last item on the divs classlist
                    let elementsPriority = eClassNames[2];
                    e.classList.remove(elementsPriority);
                    e.classList.add(obj.priority);
                    break;
                case 'tasks-project':
                    e.innerHTML = `#${obj.project}`;
                    break;
                case 'task-notes':
                    e.innerHTML = obj.notes;
                    break;
            }
        }
    }
}


function closeAllTaskElements(e) {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let taskElement = document.getElementById(task.id);
        if (task.containerOpen) {
            taskElement.style.gridTemplateRows = "1fr 0px 20px";
            toggleElementsOpacity(task.id)
            task.containerOpen = false;
        }
    }
}



//changes the task obj container open to false, so when user clicks another project, tasks get drawn closed
function closeTaskContainer() {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        task.containerOpen = false;
    }
}

//Resizes the task element, when user clicks little arrow on the element. 
function toggleTaskElementsDisplay(e) {
    let elementId = getTaskElementsId(e);
    toggleElementsSize(elementId);
    toggleElementsOpacity(elementId);
    rotateArrowBtn(e);
}

function toggleElementsOpacity(elementId) {
    let element = document.getElementById(elementId);
    let eleChildren = element.children;
    for (let i = 0; i < eleChildren.length; i++) {
        let child = eleChildren[i];
        let childClasses = child.classList;
        for (let j = 0; j < childClasses.length; j++) {
            let cc = childClasses[j];
            if (cc == 'extra-ele') {
                console.log(child);
                child.classList.toggle('hide-elements');
            } else if (cc == 'div7' || cc == 'div5') {
                child.childNodes[0].classList.toggle('hide-elements');
            }
        }
    }
}

function toggleElementsSize(id) {
    let taskElement = document.getElementById(id);
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];

        if (task.id == id) {
            if (!task.containerOpen) {
                taskElement.style.gridTemplateRows = "1fr 2fr 1fr";
                task.containerOpen = true;
            } else if (task.containerOpen) {
                taskElement.style.gridTemplateRows = "1fr 0px 20px";
                task.containerOpen = false;
            }
        }
    }
}

function getTaskElementsId(e) {
    let eleGrandParent = e.target.parentNode.parentNode;
    let targetElementId = eleGrandParent.parentNode.id;
    return targetElementId;
}

function rotateArrowBtn(e) {
    let element = e.target;
    element.classList.toggle('rotate-arrow')
}


//Depending on what user clicks, the task container header changes
function displayProjectHeader(obj, submitType) {
    taskContainer.innerHTML = '';
    let header = document.querySelector('.task-cont-header');
    let html;

    switch (submitType) {
        case 'project':
            html = `<div class="color-code ${obj.projectPriority}"></div>
            <h1>${obj.projectName}</h1>`
            break;
        case 'priority':
            html = `<div class="color-code ${obj.priority}"></div>
            <h1>${obj.name}</h1>`;
            break;
        case 'today-due':
            html = `<div></div><h1>Tasks that are due today</h1><h2>${obj}</h2>`;
            break;
        case 'tomorrow-due':
            html = `<div></div><h1>Tasks that are due tomorrow </h1> <h2>${obj}</h2>`;
            break;
        case 'home':
            html = `<span class="material-icons header-icon">home</span> <h1>Home</h1>`;
            break;
    }
    header.innerHTML = html;
}

//Depending on the filter (specific project or priority), show only those tasks
function displayFilteredTasks(filter) {
    let taskCounter = 0;
    for (let i = 0; i < tasks.length; i++) {
        let projectToLower = tasks[i].project.toLowerCase();
        if (projectToLower == filter) {
            displayNewTask(tasks[i]);
            taskCounter++
        } else if (tasks[i].priority == filter) {
            displayNewTask(tasks[i]);
            taskCounter++;
        }
    }
    if (taskCounter <= 0) {
        displayEmptyProjectGreeting('project');
    }
}

//Display tasks that are due today or tomorrow
function displayDueTasks(date) {
    let taskCounter = 0;
    let a = new Date();
    let today = getToday(a);
    let tomorrow = getTomorrow(a);

    displayDueHeaders(today, tomorrow, date);

    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        if (element.dueDate == today && date == 'today-due') {
            displayNewTask(element);
            taskCounter++
        } else if (element.dueDate == tomorrow && date == 'tomorrow-due') {
            displayNewTask(element);
            taskCounter++
        }
    }
    if (taskCounter <= 0) {
        displayEmptyProjectGreeting('date');
    }
}

//Displays Headers when user wants to see tasks that are due today or tomorrow
function displayDueHeaders(today, tomorrow, date) {
    let formatToday = today.split('-');
    let formatTom = tomorrow.split('-');

    formatToday = formatToday[2] + '.' + formatToday[1] + '.' + formatToday[0];
    formatTom = formatTom[2] + '.' + formatTom[1] + '.' + formatTom[0];

    if (date == 'today-due') {
        displayProjectHeader(formatToday, date);
    } else if (date == 'tomorrow-due') {
        displayProjectHeader(formatTom, date);
    }
}

//Checks if tasks due date is passed
function checkPassedDates(date) {
    let a = new Date();
    let today = getToday(a);
    today = new Date(today);
    let comparedDate = new Date(date);
    if (comparedDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
        return true;
    }
    return false;
}

function getToday(date) {
    let year = date.getFullYear();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    let today = `${year}-${month}-${day}`
    return today;
}

function getTomorrow(date) {
    const t = add(date, {
        days: 1
    })

    let year = t.getFullYear();
    let day = t.getDate();
    let month = t.getMonth() + 1;

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    let tomorrow = `${year}-${month}-${day}`
    return tomorrow;
}

function displayEmptyProjectGreeting(type) {
    let greeting = document.createElement('div');
    greeting.classList.add('empty-greeting');
    if (type == 'project') {
        greeting.innerHTML = `<h2>This folder seems to be empty</h2> <p>Keep your tasks organized in your projects. <br><br>
    Group tasks according to your goal or area of life or
    create custom task views to filter by priority.</p>`;
    } else if (type == 'date') {
        greeting.innerHTML = `<h2>No tasks that are due</h2><p> Group tasks according to your goal or area of life or
    create custom task views to filter by priority.</p>`;
    }

    taskContainer.appendChild(greeting);

}


function removeTaskWhenComplete(event) {
    //to get the task container id we need to go to levels up (target elements grand parent element)
    let element = event.target;
    let elementsParent = element.parentNode;
    let grandParentId = elementsParent.parentNode.id;
    removeTaskFromDisplay(grandParentId);
    removeTaskObj(grandParentId);
}

//When user deletes project, all of the tasks in that project also are erased 
function eraseTasksFromProject(projectName) {
    //arr is being re-indexed when using .splice(), which means iteration skips over an index when one is removed.
    //To fix it, loop arr backwards
    for (let i = tasks.length - 1; i >= 0; i--) {
        let projectToLower = tasks[i].project.toLowerCase();
        let eleId = tasks[i].id;
        let node = document.getElementById(eleId);

        if (projectToLower == projectName) {
            node.remove();
            tasks.splice(i, 1);
        }
    }
    saveTasksToStorage();
}

function removeTaskFromDisplay(elementId) {
    document.getElementById(elementId).style.opacity = 0;
    setTimeout(function () {
        document.getElementById(elementId).remove();
        console.log('task is now removed from view');
    }, 900);
}

function removeTaskObj(elementId) {
    if (tasks.length >= 0) {
        for (let i = tasks.length - 1; i >= 0; i--) {
            if (tasks[i].id == elementId) {
                tasks.splice(i, 1);
                saveTasksToStorage();
            }
        }
    }
}





function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//pulls tasks from local storage when page is refreshed
function readTasksFromStorage() {
    // gets information from local storage to use in displayBooks to create display
    let tasksJson = localStorage.getItem('tasks');
    if (tasksJson != null && tasksJson.length > 0) {
        //parses a JSON string to 'normal' value, number to integar yms.
        tasks = JSON.parse(tasksJson);
    } else {
        //If storage is empty, generoi these tasks on the page
        generateDefaultTasks()
    }
}

function generateDefaultTasks() {
    tasks.push(new TodoItem('Water the plants', '2021-02-06', '15.00', 'Home', 'priority2', 'When was the last time you watered your plants? '));
    tasks.push(new TodoItem('Star Wars Revenge of the Sith', '2021-02-13', '20.00', 'Movies', 'priority3', 'Buy more popcorn'));
    tasks.push(new TodoItem('Make a new project', '2021-06-31', '18.00', 'Work', 'priority1', 'Go to the project folder and add new project into it. '));
    tasks.push(new TodoItem('Change this task, so it is in a different project', '2021-04-30', '21.00', 'General', 'priority5', 'Press tasks edit button and change tasks project or priority'));
}



export {
    readTasksFromStorage,
    displayAllTasksInHomeScreen,
    makeNewTask,
    removeTaskWhenComplete,
    openFormWithObjValues,
    eraseTasksFromProject,
    displayFilteredTasks,
    displayDueTasks,
    displayProjectHeader,
    toggleTaskElementsDisplay,
    closeTaskContainer,
    editOldTask,
    closeAllTaskElements,
    checkPassedDates,
}