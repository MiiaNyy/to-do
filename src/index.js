import "./styles/main.css"
import {
    closeNav,
    openNav,
    toggleFolderDisplay,
    toggleTaskFormDisplay,
    displayNewTask,
} from "./dom"

import {
    TodoProject,
    TodoItem
} from "./classes";


let taskForm = document.querySelector('.task-form');
let openFormBtn = document.querySelectorAll('.open-task-form-btn');
let taskContainer = document.querySelector('.tasks-container');


/*
let home = new TodoProject('home', 'priority1');

let cleanRoom = new TodoItem("clean room", "today", home, "priority2", 123);

home.name = "work";
*/

let tasks = [];
let projects = [];


function formValues(form) {
    let data = new FormData(form);
    let newTask = getTaskFormValues(data);
    displayNewTask(newTask);
    tasks.push(newTask);
    saveTasksToStorage();
    console.log('There are ' + tasks.length + ' tasks in the tasks array');
}



taskContainer.addEventListener('click', function (event) {
    removeTaskFromView(event);
    removeTaskObjWhenComplete(event);
})

function removeTaskFromView(event) {
    let element = event.target;
    let eleClassList = element.classList;

    for (let i = 0; i < eleClassList.length; i++) {
        if (eleClassList[i] == 'task-completed') {
            let parentId = element.parentNode.id;
            document.getElementById(parentId).style.opacity = 0;
            setTimeout(function () {
                document.getElementById(parentId).remove();
                console.log('task is now removed from view');
            }, 900);

            console.log("Task completed button clicked");
        }
    }
}

function removeTaskObjWhenComplete(event) {
    console.log('tasks arrays length is ' + tasks.length + ' before removing obj');
    let element = event.target;
    let parentId = element.parentNode.id;
    if (tasks.length > 0) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id == parentId) {
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
    }
    /*else {
           //If storage is empty, generoi this book to the page
           addNewBook('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 310, 'read', false);
       }*/

}


function getTaskFormValues(data) {
    let taskName;
    let projectName;
    let dueDate;
    let dueTime;
    let taskPriority;

    for (const entry of data) {
        switch (entry[0]) {
            case 'task-name':
                taskName = entry[1];
                break;
            case 'project':
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
    return new TodoItem(taskName, dueDate, dueTime, projectName, taskPriority);
}

function displayTasks() {
    for (let i = 0; i < tasks.length; i++) {
        displayNewTask(tasks[i]);
    }
}


function eventListeners() {
    let navIsOpen = true;
    let navIcon = document.querySelector('#nav-icon');
    let projectsBtn = document.querySelector(".project-btn");
    let filterFolderBtn = document.querySelector(".filter-btn");

    navIcon.addEventListener('click', function () {
        this.classList.toggle("open");
        if (navIsOpen) {
            closeNav();
            navIsOpen = false;

        } else if (!navIsOpen) {
            openNav();
            navIsOpen = true;
        }
    })

    projectsBtn.addEventListener('click', function (event) {
        toggleFolderDisplay(event);
    })

    filterFolderBtn.addEventListener('click', function (event) {
        toggleFolderDisplay(event);
    })

    taskForm.addEventListener("submit", function (event) {
        formValues(taskForm);
        taskForm.reset();
        event.preventDefault();
    }, false);

    openFormBtn.forEach(function (button) {
        button.addEventListener('click', function () {
            toggleTaskFormDisplay();
        })
    })

}


function start() {
    eventListeners();
    readTasksFromStorage();
    displayTasks();
    
}

start();

if (module.hot) {
    module.hot.accept()
}