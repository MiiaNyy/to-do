import {
    TodoItem
} from "./classes";

import {
    displayNewTask,
} from "./dom";

import add from 'date-fns/add'
import format from 'date-fns/format'

let editOldTaskForm = document.querySelector('.edit-old-task-form');
let taskContainer = document.querySelector('.tasks-container');


let tasks = [];



function displayDueHeaders(today, tomorrow, date) {

    let formatToday = today.split('-');    
    let formatTom = tomorrow.split('-');
    
    formatToday =  formatToday[2] + '.' + formatToday[1] + '.' + formatToday[0];
    formatTom = formatTom[2] + '.' + formatTom[1] + '.' + formatTom[0];


    if (date == 'today-due') {
        displayProjectHeader(formatToday, date);
    } else if (date == 'tomorrow-due') {
        displayProjectHeader(formatTom, date);
    }
}

function displayDueTasks(date) {   

    let a = new Date();
    let today = getToday(a);
    let tomorrow = getTomorrow(a);

    displayDueHeaders(today, tomorrow, date);

    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        if (element.dueDate == today && date == 'today-due') {
            displayNewTask(element);
        } else if (element.dueDate == tomorrow && date == 'tomorrow-due') {
            displayNewTask(element);
        }
    }
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



function displayTasks() {
    displayProjectHeader(null, 'home');
    for (let i = 0; i < tasks.length; i++) {
        displayNewTask(tasks[i]);
    }
}

//Depending on the filter (specific project or priority), show only those tasks
function displayFilteredTasks(filter) {
    for (let i = 0; i < tasks.length; i++) {
        let projectToLower = tasks[i].project.toLowerCase();
        if (projectToLower == filter) {
            displayNewTask(tasks[i]);
        } else if (tasks[i].priority == filter) {
            displayNewTask(tasks[i]);
        }
    }
}


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
            html = `<div class="color-code ${obj.name}"></div>
            <h1>${obj.name}</h1>`;
            break;
        case 'today-due':
            html = `<div></div><h1>Tasks that are due today</h1><h2>${obj}</h2>`;
            break;
        case 'tomorrow-due':
            html = `<div></div><h1>Tasks that are due tomorrow </h1> <h2>${obj}</h2>`;
            break;
        case 'home':
            html = `<img class="home-icon" src="pics/house.png"> <h1>Home</h1>`;
            break;
    }
    header.innerHTML = html;
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



//When user wants to edit already existing task. Open obj values in the form.
function openFormWithObjValues(event) {
    let element = event.target;
    let parentId = element.parentNode.id;
    let formElements = editOldTaskForm.elements;

    let taskId;

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (task.id == parentId) {
            taskId = task.id;
            for (let j = 0; j < formElements.length; j++) {
                let eleName = formElements[j].name;
                console.log(' elements name is ' + eleName);
                switch (eleName) {
                    case 'task-name':
                        formElements[j].value = task.name;
                        break;
                    case 'project':
                        formElements[j].value = task.project;
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
                }
            }
        }
    }
    return taskId;
}

//When user has inputed info about the task, or has edited old task, make return taks obj
function getValuesFromTaskForm(data, id, submitType) {
    let taskName;
    let projectName;
    let dueDate;
    let dueTime;
    let taskPriority;

    for (const entry of data) {

        console.log(entry[0] + ' = ' + entry[1]);
        switch (entry[0]) {
            case 'task-name':
                taskName = entry[1];
                break;
            case 'select-project':
                projectName = entry[1];
                break;
            case 'dueDate':
                dueDate = entry[1];
                break;
            case 'time':
                dueTime = entry[1];
                break;
            case 'task-priority':
                taskPriority = entry[1];
                break;
        }
    }
    if (submitType == 'edit') {
        return changeTaskObjValues(id, taskName, projectName, dueDate, dueTime, taskPriority);
    } else if (submitType == 'addNew') {
        return new TodoItem(taskName, dueDate, dueTime, projectName, taskPriority);
    }
}

//When user is ready to submit edited values to the task, this changes the right task obj
function changeTaskObjValues(id, name, project, duedate, duetime, priority) {
    let obj;
    for (let i = 0; i < tasks.length; i++) {
        let element = tasks[i];
        //By comparing elements id to the obj.id we find the right obj
        if (element.id == id) {
            obj = tasks[i];
            element.name = name;
            element.project = project;
            element.dueDate = duedate;
            element.dueTime = duetime;
            element.priority = priority;
        }
    }
    return obj;
}

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

//Changes the screen view, that edited task values show
function displayEditedTask(id, obj) {
    let element = document.getElementById(id)
    let childElements = element.children;

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
                    e.innerHTML = obj.dueDate;
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
            }
        }
    }
}





function removeTaskFromDisplay(event) {
    //to get the task container id we need to go to levels up (target elements grand parent element)
    let element = event.target;
    let elementsParent = element.parentNode;
    let grandParentId = elementsParent.parentNode.id;
    
    document.getElementById(grandParentId).style.opacity = 0;
    setTimeout(function () {
        document.getElementById(grandParentId).remove();
        console.log('task is now removed from view');
    }, 900);
}

function removeTaskWhenComplete(event) {
    let element = event.target;
    let elementsParent = element.parentNode;
    let grandParentId = elementsParent.parentNode.id;

    if (tasks.length > 0) {
        for (let i = tasks.length - 1; i >= 0; i--) {
            if (tasks[i].id == grandParentId) {
                tasks.splice(i, 1);
                saveTasksToStorage();
                console.log('Removed task named ' + tasks[i].name + '. tasks length is now ' + tasks.length);
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
    tasks.push(new TodoItem('Do work project', '2021-02-06', '15.00', 'Work', 'priority2'));
    tasks.push(new TodoItem('Star Wars Revenge of the Sith', '2021-06-13', '20.00', 'Movies', 'priority3'));
    tasks.push(new TodoItem('Go outside', '2021-01-31', '18.00', 'Home', 'priority1'));
    tasks.push(new TodoItem('Clean apartment', '2021-01-30', '21.00', 'Home', 'priority5'));
}



export {
    readTasksFromStorage,
    displayTasks,
    makeNewTask,
    removeTaskFromDisplay,
    removeTaskWhenComplete,
    openFormWithObjValues,
    editOldTask,
    eraseTasksFromProject,
    displayFilteredTasks,
    displayDueTasks,
    displayProjectHeader,
}