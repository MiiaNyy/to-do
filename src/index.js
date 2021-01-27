import "./styles/main.css"
import {
    closeNav,
    openNav,
    toggleFolderDisplay,
    toggleTaskFormDisplay,
} from "./dom"

import {
    makeNewProject,
    readProjectsFromStorage,
    displayProjects, 
    saveProjectsToStorage,
} from "./projects"

import {
    readTasksFromStorage,
    displayTasks,
    makeNewTask,
    removeTaskFromView,
    removeTaskObjWhenComplete,
    openFormWithObjValues,
    editOldTask,
} from "./tasks";

let navIcon = document.querySelector('#nav-icon');
let openProjectFolder = document.querySelector(".open-project-folder");
let filterFolderBtn = document.querySelector(".filter-btn");

let taskForm = document.querySelector('.task-form');
let openTaskFormBtn = document.querySelectorAll('.open-task-form-btn');
let taskContainer = document.querySelector('.tasks-container');

let submitNewProject = document.querySelector('.add-project-form');

let threeDotMenuBtn = document.querySelector('.dropbtn');

let navIsOpen = true;
let addingNewTask = true;

let taskObjId;









function showDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function threeDotDropMenuListeners() {
    threeDotMenuBtn.addEventListener('click', function () {
        showDropdown()
    })

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (event) {
        if (!event.target.matches('.dropbtn')) {
            let dropdowns = document.getElementsByClassName("dropdown-content");

            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    })
}




function eventListeners() {
    threeDotDropMenuListeners();

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

    openProjectFolder.addEventListener('click', function (event) {
        toggleFolderDisplay(event);
    })

    filterFolderBtn.addEventListener('click', function (event) {
        toggleFolderDisplay(event);
    })

    taskForm.addEventListener("submit", function (event) {
        if (addingNewTask) {
            makeNewTask(taskForm);
            taskForm.reset();
        } else {
            editOldTask(taskForm, taskObjId);
            
        }
        event.preventDefault();
    }, false);

    openTaskFormBtn.forEach(function (button) {
        button.addEventListener('click', function () {
            toggleTaskFormDisplay();
        })
    })

    taskContainer.addEventListener('click', function (event) {
        let element = event.target.classList;
        for (let i = 0; i < element.length; i++) {
            if (element[i] == 'task-completed') {
                removeTaskFromView(event);
                removeTaskObjWhenComplete(event);
            } else if (element[i] == 'edit-task-btn') {
                addingNewTask = false;
                taskObjId = openFormWithObjValues(event);
            }
        }
    })

    submitNewProject.addEventListener('submit', function (event) {
        makeNewProject(submitNewProject);
        submitNewProject.reset();
        event.preventDefault();
    }, false);

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