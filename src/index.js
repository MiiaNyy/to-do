import "./styles/main.css"
import {
    closeNav,
    openNav,
    toggleFolderDisplay,
    createTaskEditForm,
    toggleFormBackgroundFilter,
} from "./dom"

import {
    makeNewProject,
    readProjectsFromStorage,
    displayProjects,
    displayProjectsInTaskForm,
} from "./projects"

import {
    readTasksFromStorage,
    displayTasks,
    makeNewTask,
    removeTaskFromDisplay,
    removeTaskWhenComplete,
    openFormWithObjValues,
    editOldTask,
    displayDueTasks,
} from "./tasks";

let homeBtn = document.querySelector('.home-btn');
let dateBtns = document.querySelectorAll('.due-btn');

let navIcon = document.querySelector('#nav-icon');
let openProjectFolder = document.querySelector(".open-project-folder");
let filterFolderBtn = document.querySelector(".filter-btn");

let taskForm = document.querySelector('.task-form');
let openNewTaskFormBtn = document.querySelectorAll('.open-task-form-btn');
let taskContainer = document.querySelector('.tasks-container');

let submitNewProject = document.querySelector('.add-project-form');

let cancelTaskForm = document.querySelector('.form-button-cancel');
let closeTaskForm = document.querySelector('.close-task-form');

let editOldTaskForm = document.querySelector('.edit-old-task-form');

let navIsOpen = true;
let formIsOpen = false;

let taskObjId;



function toggleTaskFormDisplay() {
    toggleFormBackgroundFilter();
    let form = document.querySelector('.task-form');
    if (!formIsOpen) {
        form.style.display = 'block';
        formIsOpen = true;
    } else if (formIsOpen) {
        form.style.display = 'none';
        formIsOpen = false;
    }
}


function toggleNavDisplay() {
    navIcon.classList.toggle("open");
    if (navIsOpen) {
        closeNav();
        navIsOpen = false;

    } else if (!navIsOpen) {
        openNav();
        navIsOpen = true;
    }
}


function eventListeners() {
    closeTaskForm.addEventListener('click', function () {
        taskForm.reset();
        toggleTaskFormDisplay();
    })

    cancelTaskForm.addEventListener('click', function () {
        taskForm.reset();
        toggleTaskFormDisplay();
    })

    //Opens and closes sidebar nav
    navIcon.addEventListener('click', function () {
        toggleNavDisplay();
    })

    //Opens and closes sidebars project folder
    openProjectFolder.addEventListener('click', function (event) {
        toggleFolderDisplay(event);
    })

    //Opens and closes sidebars filter priority folder
    filterFolderBtn.addEventListener('click', function (event) {
        toggleFolderDisplay(event);
    })

    //User submits new task
    taskForm.addEventListener("submit", function (event) {  
        toggleFormBackgroundFilter();
        formIsOpen = false;      
        makeNewTask(taskForm);
        taskForm.reset();
        event.preventDefault();
        taskForm.style.display = 'none';
    }, false);

    //When user wants to submit edited values from form
    editOldTaskForm.addEventListener('submit', function (event) {
        editOldTask(editOldTaskForm, taskObjId);
        editOldTaskForm.reset();
        editOldTaskForm.innerHTML = '';
        event.preventDefault();
    }, false)

    //Opens and closes task form when user wants to add new tasks
    openNewTaskFormBtn.forEach(function (button) {
        button.addEventListener('click', function () {
            displayProjectsInTaskForm('add new');
            toggleTaskFormDisplay();
        })
    })

    taskContainer.addEventListener('click', function (event) {
        let element = event.target.classList;
        for (let i = 0; i < element.length; i++) {
            if (element[i] == 'task-completed') {
                removeTaskFromDisplay(event);
                removeTaskWhenComplete(event);

                //open task editing form
            } else if (element[i] == 'edit-task-btn') {
                createTaskEditForm();

                /*addingNewTask = false;*/
                taskObjId = openFormWithObjValues(event);

            }
        }
    })

    //User adds new project
    submitNewProject.addEventListener('click', function (event) {
        if (event.target.className == 'add-project') {
            makeNewProject(submitNewProject);
            submitNewProject.reset();
            event.preventDefault();
            submitNewProject.style.opacity = 0;
            submitNewProject.innerHTML = '';
        }
    }, false);

    homeBtn.addEventListener('click', function (e) {
        displayTasks();
    })

    dateBtns.forEach(function (button) {
        button.addEventListener('click', function (e) {
            let elementId = e.target.id;
            if(elementId == 'today-due' || elementId == 'tomorrow-due') {
                console.log(elementId);
                displayDueTasks(elementId);
            }            
        })
    })

}




function start() {
    eventListeners();
    readTasksFromStorage();
    readProjectsFromStorage();
    displayTasks();
    displayProjects();
}

start();



if (module.hot) {
    module.hot.accept()
}