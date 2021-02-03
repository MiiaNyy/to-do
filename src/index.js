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
    checkEmptyInput,
    getObjForHeader,
    submitEditedProject,
    eraseProject,
    openProjectEditingForm,
    displayProjectsTasks,
} from "./projects"

import {
    readTasksFromStorage,
    displayTasks,
    makeNewTask,
    removeTaskWhenComplete,
    openFormWithObjValues,
    displayDueTasks,
    toggleTaskElementsDisplay,
    closeTaskContainer,
    editOldTask,
    closeAllTaskElements,
    displayProjectHeader,
    displayFilteredTasks,
} from "./tasks";

let homeBtn = document.querySelector('.home-btn');
let dateBtns = document.querySelectorAll('.due-btn');

let navIcon = document.querySelector('#nav-icon');
let openProjectFolder = document.querySelector(".open-project-folder");
let filterFolderBtn = document.querySelector(".filter-btn");

let taskForm = document.querySelector('.task-form');
let openNewTaskFormBtn = document.querySelectorAll('.open-task-form-btn');
let taskContainer = document.querySelector('.tasks-container');

let projectForm = document.querySelector('.add-project-form');

let closeTaskForm = document.querySelector('.close-task-form');


let projectsFolder = document.querySelector('.project-menu');
let priorityFolderItems = document.querySelectorAll('.filter-name');

let openProjectForm = document.querySelector('.open-project-form');


let taskFormBtnContainer = document.querySelector('.form-button-cont');


let navIsOpen = true;
let taskFormIsOpen = false;

let projectFormOpen = false;



let taskObjId;


//Toggles project form into and off from display
function toggleProjectFormDisplay(type) {
    toggleFormBackgroundFilter();
    if (!projectFormOpen) {
        if (type == 'add') {
            displayProjectForm('Add project');
            projectForm.style.opacity = 1;
        } else if (type == 'edit') {
            displayProjectForm('Edit project')
        }
        projectFormOpen = true;
        
    } else if (type == 'remove' || projectFormOpen) {
        removeProjectForm();
        projectFormOpen = false;
    }
    console.log('projectForm is now open? ' + projectFormOpen + ' and type of toggling was ' + type);
}

//Toggles task form into and off from display
function toggleTaskFormDisplay() {
    toggleFormBackgroundFilter();
    let form = document.querySelector('.task-form');
    if (!taskFormIsOpen) {
        form.style.display = 'block';
        taskFormIsOpen = true;
    } else if (taskFormIsOpen) {
        form.style.display = 'none';
        taskFormIsOpen = false;
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


function openTaskEditingForm(event) {
    closeAllTaskElements(event);
    addIdentifyersToTaskForm('edit');
    displayProjectsInTaskForm();
    taskObjId = openFormWithObjValues(event);
    toggleTaskFormDisplay();
}

function taskListeners() {
    //User clicks cross in a task form and closes form
    closeTaskForm.addEventListener('click', function () {
        taskForm.reset();
        toggleTaskFormDisplay();
    })


    taskFormBtnContainer.addEventListener("click", function (event) {
        let element = event.target.classList;
        for (let i = 0; i < element.length; i++) {
            //User submits new task
            if (element[i] == 'form-button-add') {
                makeNewTask(taskForm);
                toggleTaskFormDisplay();
                taskForm.reset();
                event.preventDefault();
            }
            //User clicks cancel button and form closes
            if (element[i] == 'form-button-cancel') {
                taskForm.reset();
                toggleTaskFormDisplay();
            }
            //Edited task is submited
            if (element[i] == 'form-button-edit') {
                editOldTask(taskForm, taskObjId);
                toggleTaskFormDisplay();
                taskForm.reset();
                event.preventDefault();
            }
        }
    }, false);




    //Opens and closes task form when user wants to add new tasks
    openNewTaskFormBtn.forEach(function (button) {
        button.addEventListener('click', function (event) {
            closeAllTaskElements(event);
            addIdentifyersToTaskForm('add new');
            displayProjectsInTaskForm();
            toggleTaskFormDisplay();
            displayTasks();
        })
    })

    taskContainer.addEventListener('click', function (event) {
        let element = event.target.classList;
        for (let i = 0; i < element.length; i++) {
            //User clicks checkmark indicating that task is done. Task can be removed from view and tasks obj
            if (element[i] == 'task-completed') {
                removeTaskWhenComplete(event);

                //open task editing form
            } else if (element[i] == 'edit-task-btn') {
                openTaskEditingForm(event);
                displayTasks();

            } else if (element[i] == 'task-arrow-button') {
                toggleTaskElementsDisplay(event);
            }
        }
    })
}



function projectListeners() {

    //Edits already existing projects
    projectForm.addEventListener('click', function (e) {
        if (e.target.className == 'edit-project') {
            submitEditedProject();
            toggleProjectFormDisplay('remove');

        } else if (e.target.className == 'delete-project') {
            eraseProject(e);
            toggleProjectFormDisplay('remove');
        }
    }, false)

    //User adds new project
    projectForm.addEventListener('click', function (event) {
        let targetName = event.target.className;
        if (targetName == 'add-project') {
            let inputIsFilled = checkEmptyInput(projectForm);
            if (inputIsFilled) {
                makeNewProject(projectForm);
                toggleProjectFormDisplay('add')
            }
        } else if (targetName == 'cancel-project-form' || targetName == 'close-project-form') {
            projectForm.reset();
            toggleProjectFormDisplay('remove');
        }
    }, false);

    //Listens project folder
    projectsFolder.addEventListener('click', function (e) {
        let elementClasses = e.target.classList;
        let elementId = e.target.id;

        for (let i = 0; i < elementClasses.length; i++) {
            if (elementClasses[i] == 'settings-icon') {
                toggleProjectFormDisplay('edit');
                openProjectEditingForm(e);
                displayTasks();
                
            }
            if (elementClasses[i] == 'project-name') {
                closeTaskContainer();
                displayProjectsTasks(elementId);
            }
        }
    })



    openProjectForm.addEventListener('click', function (e) {
        displayTasks();
        closeAllTaskElements(e);
        toggleProjectFormDisplay('add');
    })
}

function sideBarListeners() {


    priorityFolderItems.forEach(item => {
        item.addEventListener('click', function (e) {
            let elementId = e.target.id;
            let projectObj = getObjForHeader(elementId);
            displayProjectHeader(projectObj, 'priority');
            displayFilteredTasks(elementId);
        })
    })

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