import {
    TodoProject
} from "./classes";

import {
    displayNewProject,
    displayProjectForm,
    toggleFormBackgroundFilter,
} from "./dom";

import {
    eraseTasksFromProject,
    closeTaskContainer,
    closeAllTaskElements,
    displayProjectHeader,
    displayFilteredTasks,
    displayTasks,
} from "./tasks";




let projectForm = document.querySelector('.add-project-form');









let projects = [];
let priorityArr = ['Priority 1', 'Priority 2', 'Priority 3', 'Priority 4', 'Priority 5']

let projectId;


function openProjectEditingForm(e) {
    //Background changes to home screen
    displayTasks();
    closeAllTaskElements(e);    
    projectId = openFormWithObjValues(e);
    projectForm.style.opacity = 1;
}

function submitEditedProject() {
    editProject(projectForm, projectId);
    projectForm.reset();    
}

//Checks that project form input field is not empty
function checkEmptyInput(form) {
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

//Return right obj, that is later used to generate task header
function getObjForHeader(id) {
    for (let i = 0; i < projects.length; i++) {
        if (id == projects[i].nameToLower) {
            console.log(projects[i]);
            return projects[i];
        }
    }

    for (let i = 0; i < priorityArr.length; i++) {
        let toLower = priorityArr[i].toLowerCase();
        let priority = toLower.replace(/\s+/g, '');
        if (id == priority) {
            let priorityObj = {
                name: priorityArr[i],
                priority: id
            };
            return priorityObj
        }
    }
}


function removeProjectForm() {
    projectForm.style.display = 'none';
    setTimeout(function () {
        projectForm.innerHTML = '';
    }, 1000);

}


//When user clicks specific project, open right tasks in screen
function displayProjectsTasks(elementId) {
    console.log('element id is ' + elementId);
    let projectObj = getObjForHeader(elementId);
    displayProjectHeader(projectObj, 'project');
    displayFilteredTasks(elementId);

}



function displayProjectsInTaskForm() {
    let selectCont = document.querySelector('.select-project');
    selectCont.innerHTML = '';

    let select = document.createElement('select');
    select.id = "select-project";
    select.name = "select-project";

    for (let i = 0; i < projects.length; i++) {
        let projectName = projects[i].projectName;
        select.innerHTML += `<option value= ${projectName.toLowerCase()}>${projectName}`;
    }
    selectCont.appendChild(select);
}




function eraseProject(e) {
    let confirmation = confirm("You are about to delete a project and all of the tasks in that project.\nAre you sure?")
    if (confirmation) {
        let objName = getProjectName(projectId);
        eraseTasksFromProject(objName);
        deleteProjectObj(projectId);
        removeProjectFromDisplay(projectId);
    }
    saveProjectsToStorage();
    e.preventDefault();
}

function getProjectName(id) {
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id == id) {
            let projectName = projects[i].projectName;
            return projectName.toLowerCase();
        }
    }
}

function deleteProjectObj(id) {
    for (let i = projects.length - 1; i >= 0; i--) {
        if (projects[i].id == id) {
            console.log('project ' + projects[i].projectName + ' is being removed');
            projects.splice(i, 1);
            saveProjectsToStorage();
        }
    }
}

function removeProjectFromDisplay(id) {
    let element = document.getElementById(id);
    element.style.opacity = 0;
    element.style.marginBottom = '-40px';
    setTimeout(function () {
        element.remove();
        console.log('project is now removed from view');
    }, 900);
}

function checkForDuplicateNames(projectName) {
    let nameToLower = projectName.toLowerCase();
    nameToLower = nameToLower.replace(/\s+/g, '');

    for (let i = 0; i < projects.length; i++) {
        let project = projects[i].projectName.toLowerCase();
        project = project.replace(/\s+/g, '');
        if (project == nameToLower) {
            alert('You are trying to add a project that already exist');
            return false;
        }
    }
    return true;
}

function editProject(form, id) {
    let data = new FormData(form);
    let obj = getNewProject(data, id, 'edit');
    displayEditedProject(obj, id);
    saveProjectsToStorage();
}

function displayEditedProject(obj, id) {
    let element = document.getElementById(id);
    let childElements = element.children;

    for (let i = 0; i < childElements.length; i++) {
        const e = childElements[i];
        //elements class name list
        const eClassNames = e.classList;

        for (let j = 0; j < eClassNames.length; j++) {
            switch (eClassNames[j]) {
                case 'project-name':
                    e.innerHTML = obj.projectName;
                    break;
                case 'color-code':
                    //Because class name priority is always on the last item on the divs classlist
                    let elementsPriority = eClassNames[1];
                    e.classList.remove(elementsPriority);
                    e.classList.add(obj.projectPriority);
                    break;
            }
        }
    }
}

function getNewProject(data, id, submitType) {
    let obj = {};

    for (const entry of data) {
        console.log(entry[0] + ' = ' + entry[1]);
        if (entry[0] == 'task-priority') {
            obj.priority = entry[1];
        } else if (entry[0] == 'project-name') {
            obj.name = entry[1];
        }
    }

    if (submitType == 'edit') {
        return changeProjectValuesAfterEdit(id, obj.name, obj.priority)
    } else if (submitType == 'addNew') {
        return new TodoProject(obj.name, obj.priority);
    }

}



function changeProjectValuesAfterEdit(id, name, priority) {
    let obj;
    for (let i = 0; i < projects.length; i++) {
        let element = projects[i];
        //By comparing elements id to the obj.id we find the right obj
        if (element.id == id) {
            obj = projects[i];
            console.log('obj name before editing is ' + obj.projectName);
            element.projectName = name;
            element.projectPriority = priority;
        }
    }
    console.log('obj name after editing is ' + obj.projectName);
    return obj;
}

//When user wants to edit already existing project. Open obj values in the form.
function openFormWithObjValues(event) {
    let element = event.target;
    let parentId = element.parentNode.id;
    let formElements = projectForm.elements;
    let projectId;

    for (let i = 0; i < projects.length; i++) {
        let project = projects[i];
        if (project.id == parentId) {
            console.log(parentId);
            projectId = project.id;

            for (let j = 0; j < formElements.length; j++) {
                let eleName = formElements[j].name;
                switch (eleName) {
                    case 'project-name':
                        formElements[j].value = project.projectName;
                        break;
                    case 'task-priority':
                        if (formElements[j].id == project.projectPriority) {
                            console.log(formElements[j].id);
                            formElements[j].checked = true;
                        }
                        break;
                }
            }
        }
    }
    return projectId;
}


function makeNewProject(form) {
    let data = new FormData(form);
    let newProject = getNewProject(data, null, 'addNew');
    projects.push(newProject);
    displayNewProject(newProject);
    saveProjectsToStorage();
}


function displayProjects() {
    for (let i = 0; i < projects.length; i++) {
        displayNewProject(projects[i]);
    }
}

function generateDefaultProjects() {
    projects.push(new TodoProject('General', 'priority2'), new TodoProject('Home', 'priority3'), new TodoProject('Work', 'priority1'), new TodoProject('Movies', 'priority5'));
}


function saveProjectsToStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function readProjectsFromStorage() {
    let projectsJson = localStorage.getItem('projects');

    if (projectsJson != null && projectsJson.length > 0) {
        projects = JSON.parse(projectsJson);
    } else {
        generateDefaultProjects();
    }
}




export {
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
}