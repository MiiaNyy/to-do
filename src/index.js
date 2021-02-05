import "./styles/main.css"

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
    editTaskIdentifyers
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

let darkModeSlider = document.querySelector('.slider');

let navIcon = document.querySelector('#nav-icon');
let openProjectFolder = document.querySelector(".open-project-folder");
let filterFolderBtn = document.querySelector(".filter-btn");

let taskForm = document.querySelector('.task-form');
let openNewTaskFormBtn = document.querySelectorAll('.open-task-form-btn');
let taskContainer = document.querySelector('.tasks-container');

let projectForm = document.querySelector('.add-project-form');

let closeTaskFormBtn = document.querySelector('.close-task-form');


let projectsFolder = document.querySelector('.project-menu');
let priorityFolderItems = document.querySelectorAll('.filter-name');

let openProjectFormBtn = document.querySelector('.open-project-form');


let taskFormBtnContainer = document.querySelector('.form-button-cont');


let navIsOpen = true;
let taskFormIsOpen = false;

let projectFormOpen = false;



let taskObjId;


//Toggles project form into and off from display
function toggleProjectFormDisplay(callback) {
    toggleFormBackgroundFilter();
    callback();
}

function closeProjectForm() {
    removeProjectForm();
    projectFormOpen = false;
}

function openProjectForm() {
    projectFormOpen = true;
    projectForm.style.display = 'block';
    displayProjectForm('Edit project');
}

//Toggles task form into and off from display
function toggleTaskFormDisplay(callback) {
    toggleFormBackgroundFilter();
    let form = document.querySelector('.task-form');
    callback(form);
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




function openTaskEditingForm(event) {
    closeAllTaskElements(event);
    addIdentifyersToTaskForm(editTaskIdentifyers);
    displayProjectsInTaskForm();
    taskObjId = openFormWithObjValues(event);
    toggleTaskFormDisplay(openTaskForm);
}

function taskListeners() {
    //User clicks cross in a task form and closes form
    closeTaskFormBtn.addEventListener('click', function () {
        taskForm.reset();
        toggleTaskFormDisplay(closeTaskForm);
    })


    taskFormBtnContainer.addEventListener("click", function (event) {
        let targetClassList = event.target.classList;

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
            displayTasks();
        })
    })

    taskContainer.addEventListener('click', function (event) {
        let targetClassList = event.target.classList;
        //User clicks checkmark indicating that task is done. Task can be removed from view and tasks obj
        if (targetClassList.contains('task-completed')) {
            removeTaskWhenComplete(event);
            document.querySelector('.task-completed-message').style.opacity = 1;
            document.querySelector('.task-completed-message').style.transform = 'translateY(-100px)';
            setTimeout(function () {
                document.querySelector('.task-completed-message').style.transform = 'translateY(0px)';
            }, 3000);
            setTimeout(function () {
                document.querySelector('.task-completed-message').style.opacity = 0;
            }, 3700);

            
            //open task editing form
        } else if (targetClassList.contains('edit-task-btn')) {
            openTaskEditingForm(event);
            displayTasks();

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
        if (targetClassList.contains('settings-icon')) {
            toggleProjectFormDisplay(() => {
                projectFormOpen = true;
                projectForm.style.display = 'block';
                displayProjectForm('Edit project');
            })
            openProjectEditingForm(event);
            displayTasks();
        }
        if (targetClassList.contains('project-name')) {
            closeTaskContainer();
            displayProjectsTasks(elementId);
        }
    })

    openProjectFormBtn.addEventListener('click', function (event) {
        displayTasks();
        closeAllTaskElements(event);
        toggleProjectFormDisplay(() => {
            projectFormOpen = true;
            projectForm.style.display = 'block';
            displayProjectForm('Add project');
        })
    })
}

function sideBarListeners() {

    darkModeSlider.addEventListener('click', function (e) {
        saveDarkModeToStorage();
        toggleDarkMode();
    })

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
    readDarkmodeFromStorage();
}

start();



if (module.hot) {
    module.hot.accept()
}