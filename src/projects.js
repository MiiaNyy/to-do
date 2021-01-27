import {TodoProject} from "./classes";
import {displayNewProject} from "./dom";

let projects = [];

function makeNewProject(form) {
    let data = new FormData(form);
    let newProject = getNewProject(data);
    projects.push(newProject);
    displayNewProject(newProject);
    saveProjectsToStorage();
}

function displayProjects() {
    console.log('There is ' + projects.length + ' projects in the array');
    for (let i = 0; i < projects.length; i++) {
        displayNewProject(projects[i]);
    }
}
function getNewProject(data) {
    let projectName;
    let projectPriority;

    for (const entry of data) {
        console.log(entry[0] + ' = ' + entry[1]);
        if (entry[0] == 'task-priority') {
            projectPriority = entry[1];
        } else if (entry[0] == 'project-name') {
            projectName = entry[1];
        }
    }
    return new TodoProject(projectName, projectPriority);
}


function generateDefaultProjects() {
    let general = new TodoProject('General', 'priority2');
    let home = new TodoProject('Home', 'priority3');
    let work = new TodoProject('Work', 'priority1');
    let movies = new TodoProject('Movies to watch', 'priority5')
    projects.push(general, home, work, movies);
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

export {makeNewProject, readProjectsFromStorage, displayProjects}