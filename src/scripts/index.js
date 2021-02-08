import "../styles/main.css"

import {
    closeNav,
    openNav,
    toggleFolderDisplay,
    toggleFormBackgroundFilter,
    displayProjectForm,
    addIdentifyersToTaskForm,
    toggleDarkMode,
    readDarkmodeFromStorage,
    saveDarkModeToStorage,
    newTaskIdentifyers,
    editTaskIdentifyers,
    toggleTaskCompleteMsgDisplay,
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
    displayAllTasksInHomeScreen,
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


let darkModeSlider = document.querySelector('.slider');
let homeBtn = document.querySelector('.home-btn');
let dateBtns = document.querySelectorAll('.due-btn');
let navIcon = document.querySelector('#nav-icon');

let openProjectFolder = document.querySelector(".open-project-folder");
let filterFolderBtn = document.querySelector(".filter-btn");
let projectsFolder = document.querySelector('.project-menu');
let priorityFolderItems = document.querySelectorAll('.filter-name');

let taskForm = document.querySelector('.task-form');
let projectForm = document.querySelector('.add-project-form');

let openProjectFormBtn = document.querySelector('.open-project-form');
let openNewTaskFormBtn = document.querySelectorAll('.open-task-form-btn');
let closeTaskFormBtn = document.querySelector('.close-task-form');

let taskContainer = document.querySelector('.tasks-container');

let taskFormBtnContainer = document.querySelector('.form-button-cont');

let navIsOpen = true;
let taskFormIsOpen = false;
let projectFormOpen = false;

let taskObjId;

function start() {
    eventListeners();
    readTasksFromStorage();
    readProjectsFromStorage();
    displayAllTasksInHomeScreen();
    displayProjects();
    readDarkmodeFromStorage();
}

function eventListeners() {
    taskListeners();
    projectListeners();
    sideBarListeners();
}

function taskListeners() {
    //User clicks cross in a task form and closes form
    closeTaskFormBtn.addEventListener('click', function () {
        taskForm.reset();
        toggleTaskFormDisplay(closeTaskForm);
    })

    taskFormBtnContainer.addEventListener("click", function (event) {
        let targetClassList = event.target.classList;

        //User has filled task form and clicks add task button
        if (targetClassList.contains('form-button-add')) {
            makeNewTask(taskForm);
            toggleTaskFormDisplay(closeTaskForm);
            taskForm.reset();
            event.preventDefault();
        }
        //User clicks cancel button and form closes
        if (targetClassList.contains('form-button-cancel')) {
            taskForm.reset();
            toggleTaskFormDisplay(closeTaskForm);
        }
        //Edited task is submited
        if (targetClassList.contains('form-button-edit')) {
            editOldTask(taskForm, taskObjId);
            toggleTaskFormDisplay(closeTaskForm);
            taskForm.reset();
            event.preventDefault();
        }
    }, false);

    //Opens and closes task form when user wants to add new tasks
    openNewTaskFormBtn.forEach(function (button) {
        button.addEventListener('click', function (event) {
            closeAllTaskElements(event);
            addIdentifyersToTaskForm(newTaskIdentifyers);
            displayProjectsInTaskForm();
            if (!taskFormIsOpen) {
                toggleTaskFormDisplay(openTaskForm);
            }
            displayAllTasksInHomeScreen();
        })
    })


    taskContainer.addEventListener('click', function (event) {
        let targetClassList = event.target.classList;
        //User clicks checkmark indicating that task is done. Task can be removed from view and tasks obj
        if (targetClassList.contains('task-completed')) {
            removeTaskWhenComplete(event);
            toggleTaskCompleteMsgDisplay();
        //open task editing form
        } else if (targetClassList.contains('edit-task-btn')) {
            openTaskEditingForm(event);
            displayAllTasksInHomeScreen();
        } else if (targetClassList.contains('task-arrow-button')) {
            toggleTaskElementsDisplay(event);
        }
    })
}

function projectListeners() {
    //Edits already existing projects
    projectForm.addEventListener('click', function (event) {
        let targetClassList = event.target.classList;
        if (targetClassList.contains('edit-project')) {
            submitEditedProject();
            toggleProjectFormDisplay(closeProjectForm);
        } else if (targetClassList.contains('delete-project')) {
            eraseProject(event);
            toggleProjectFormDisplay(closeProjectForm);
        }
    }, false)

    //User adds new project
    projectForm.addEventListener('click', function (event) {
        let targetClassList = event.target.classList;
        if (targetClassList.contains('add-project')) {
            let inputIsFilled = checkEmptyInput(projectForm);
            if (inputIsFilled) {
                makeNewProject(projectForm);
                toggleProjectFormDisplay(closeProjectForm)
            }
        } else if (targetClassList.contains('cancel-project-form') || targetClassList.contains('close-project-form')) {
            toggleProjectFormDisplay(closeProjectForm);
            projectForm.reset();
        }
    }, false);

    //Listens project folder
    projectsFolder.addEventListener('click', function (event) {
        let elementId = event.target.id;
        let targetClassList = event.target.classList;
    //User clicks settings icon and edit project form opens
        if (targetClassList.contains('settings-icon')) {
            toggleProjectFormDisplay(() => {
                projectFormOpen = true;
                projectForm.style.display = 'block';
                displayProjectForm('Edit project');
            })
            openProjectEditingForm(event);
            displayAllTasksInHomeScreen();
        }
    //User clicks project name, and all of the tasks that are int hat project show in the screen
        if (targetClassList.contains('project-name')) {
            closeTaskContainer();
            displayProjectsTasks(elementId);
        }
    })

    //Add new project button is clicked
    openProjectFormBtn.addEventListener('click', function (event) {
        displayAllTasksInHomeScreen();
        closeAllTaskElements(event);
        toggleProjectFormDisplay(() => {
            projectFormOpen = true;
            projectForm.style.display = 'block';
            displayProjectForm('Add project');
        })
    })
}

function sideBarListeners() {
    //Dark mode slider is clicked
    darkModeSlider.addEventListener('click', function (e) {
        saveDarkModeToStorage();
        toggleDarkMode();
    })

    //User clicks priority item in the priority folder and all of the tasks that have that priority is shown in the screen
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

    //Home button is clicked, and all of the tasks are shown in the screen
    homeBtn.addEventListener('click', function (e) {
        closeTaskContainer()
        displayAllTasksInHomeScreen();
    })

    //user clicks today or tomorrow btn, and all of the tasks that are due today/tomorrow is shown
    dateBtns.forEach(function (button) {
        button.addEventListener('click', function (e) {
            closeTaskContainer();
            let elementId = e.target.id;
            if (elementId == 'today-due' || elementId == 'tomorrow-due') {
                displayDueTasks(elementId);
            }
        })
    })
}


function openTaskEditingForm(event) {
    closeAllTaskElements(event);
    addIdentifyersToTaskForm(editTaskIdentifyers);
    displayProjectsInTaskForm();
    taskObjId = openFormWithObjValues(event);
    toggleTaskFormDisplay(openTaskForm);
}

//Toggles task form into and off from display
function toggleTaskFormDisplay(callback) {
    toggleFormBackgroundFilter();
    let form = document.querySelector('.task-form');
    callback(form);
}

//Toggles project form into and off from display
function toggleProjectFormDisplay(callback) {
    toggleFormBackgroundFilter();
    callback();
}

function closeProjectForm() {
    removeProjectForm();
    projectFormOpen = false;
}

function openTaskForm(form) {
    form.style.display = 'block';
    taskFormIsOpen = true;
}

function closeTaskForm(form) {
    form.style.display = 'none';
    taskFormIsOpen = false;
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

start();


if (module.hot) {
    module.hot.accept()
}