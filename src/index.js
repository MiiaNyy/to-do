import "./styles/main.css"
import {
    closeNav,
    openNav,
    toggleFolderDisplay,
    toggleFormBackgroundFilter,
    displayProjectForm,
    addIdentifyersToTaskForm,
} from "./dom"

import {
    makeNewProject,
    readProjectsFromStorage,
    displayProjects,
    displayProjectsInTaskForm,
    removeProjectForm,
} from "./projects"

import {
    readTasksFromStorage,
    displayTasks,
    makeNewTask,
    removeTaskFromDisplay,
    removeTaskWhenComplete,
    openFormWithObjValues,
    displayDueTasks,
    toggleTaskElementsDisplay,
    closeTaskContainer,
    editOldTask,
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


let openProjectForm = document.querySelector('.open-project-form');


let taskFormBtnContainer = document.querySelector('.form-button-cont');


let navIsOpen = true;
let formIsOpen = false;

let projectFormOpen = false;



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

function toggleProjectFormDisplay() {
    if (!projectFormOpen) {
        submitNewProject.style.opacity = 1;
        displayProjectForm('Add project');
        projectFormOpen = true;
    } else {
        removeProjectForm();
        projectFormOpen = false;
    }
}


function taskListeners() {
    closeTaskForm.addEventListener('click', function () {
        taskForm.reset();
        toggleTaskFormDisplay();
    })

    //User submits new task
    taskFormBtnContainer.addEventListener("click", function (event) {
        let element = event.target.classList;
        for (let i = 0; i < element.length; i++) {
            if (element[i] == 'form-button-add') {
                toggleTaskFormDisplay();
                //toggleFormBackgroundFilter();
                makeNewTask(taskForm);
                taskForm.reset();
                event.preventDefault();
            }
            if (element[i] == 'form-button-cancel') {
                taskForm.reset();
                toggleTaskFormDisplay();
            }
        //Edited task is submited
            if(element[i] == 'form-button-edit') {
                editOldTask(taskForm, taskObjId);
                toggleTaskFormDisplay();
                console.log('task form is open? ' + formIsOpen);
                taskForm.reset();
                event.preventDefault();
            }
        }
    }, false);




    //Opens and closes task form when user wants to add new tasks
    openNewTaskFormBtn.forEach(function (button) {
        button.addEventListener('click', function () {
            closeTaskContainer();
            addIdentifyersToTaskForm('add new');
            displayProjectsInTaskForm();
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
                console.log('edit task button pressed');
                closeTaskContainer();
                //Kun painetaan edit task, task container ei pienene vaikka sen pitäisi!Korjaa huomenna!!
                //toggleTaskElementsDisplay(event);
                addIdentifyersToTaskForm('edit');
                displayProjectsInTaskForm();               
                taskObjId = openFormWithObjValues(event);
                toggleTaskFormDisplay();
                console.log('task form is open? ' + formIsOpen);
                
            } else if (element[i] == 'task-arrow-button') {
                toggleTaskElementsDisplay(event);
            }
        }
    })
}

function projectListeners() {

    //User adds new project
    submitNewProject.addEventListener('click', function (event) {
        if (event.target.className == 'add-project') {
            let inputIsFilled = checkData(submitNewProject);
            if (inputIsFilled) {
                makeNewProject(submitNewProject);
                toggleFormBackgroundFilter();
                submitNewProject.style.opacity = 0;
                submitNewProject.innerHTML = '';
                projectFormOpen = false;
            }


        } else if (event.target.className == 'cancel-project-form') {
            toggleFormBackgroundFilter();
            submitNewProject.reset();
            submitNewProject.style.opacity = 0;
            submitNewProject.innerHTML = '';
            projectFormOpen = false;
        }
    }, false);

    openProjectForm.addEventListener('click', function () {
        closeTaskContainer()
        toggleFormBackgroundFilter()
        toggleProjectFormDisplay();
    })
}

function sideBarListeners() {

    //Opens and closes sidebars project folder
    openProjectFolder.addEventListener('click', function (event) {
        closeTaskContainer();
        toggleFolderDisplay(event);
    })


    //Opens and closes sidebar nav
    navIcon.addEventListener('click', function () {
        toggleNavDisplay();
    })


    //Opens and closes sidebars filter priority folder
    filterFolderBtn.addEventListener('click', function (event) {
        closeTaskContainer();
        toggleFolderDisplay(event);
    })




    homeBtn.addEventListener('click', function (e) {
        closeTaskContainer()
        displayTasks();
    })

    dateBtns.forEach(function (button) {
        button.addEventListener('click', function (e) {
            closeTaskContainer();
            let elementId = e.target.id;
            if (elementId == 'today-due' || elementId == 'tomorrow-due') {
                console.log(elementId);
                displayDueTasks(elementId);
            }
        })
    })
}

function eventListeners() {
    taskListeners();
    projectListeners();
    sideBarListeners();
}



function checkData(form) {
    let data = new FormData(form);
    for (const entry of data) {
        console.log(entry[0] + ' = ' + entry[1]);
        if (entry[0] == 'project-name' && entry[1].length <= 0) {

            console.log('empty input found');
            return false;
        } else {
            return true;
        }
    }
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