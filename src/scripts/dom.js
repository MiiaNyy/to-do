import {
    checkPassedDates
} from "./tasks";

let docFrame = document.querySelectorAll(".main");
let taskContainer = document.querySelector('.tasks-container');
const projectForm = document.querySelector('.add-project-form');

let projectsFolderIsOpen = false;
let filterFolderIsOpen = false;
let darkMode = false;

function displayNewTask(obj) {
    let date = getFormattedDate(obj.dueDate);
    let dateIsInPast = checkPassedDates(obj.dueDate);
    let taskHtml = document.createElement('div');

    if (obj.dueTime === '') {
        obj.dueTime = 'No schedule'
    }
    if (dateIsInPast) {
        taskHtml.classList.add('past-due-date');
    }

    taskHtml.classList.add('task', 'fade-effect');

    taskHtml.id = obj.id;
    taskHtml.innerHTML = createTaskHtml(obj, date);
    taskContainer.appendChild(taskHtml);
}

function getFormattedDate(date) {
    if (date === '') {
        return 'No due date'
    }
    let newDate = date.split('-');
    return `${newDate[2]}.${newDate[1]}.${newDate[0]}`;
}

function createTaskHtml(obj, date) {
    let darkModeClass = '';
    if (darkMode) {
        darkModeClass = 'dark-mode-icons'
    }
    return `<label class="div1 checkbox-container">\n    <input type="checkbox">\n    <span class="task-completed checkmark"></span>\n    </label>  \n    <div class="div2 color-code ${obj.priority}"></div>\n    <div class = "div3 task-name" >${obj.name}</div>\n    <div class="div4 fade-effect hide-elements extra-ele tasks-project"><p>#${obj.project}</p></div>\n    <div class="div5"><span class="material-icons calender-icon hide-elements ${darkModeClass} md-18 ">today</span></div>\n    <div class="div6 due-date hide-elements extra-ele">${date}</div>\n    <div class="div7"><span class="material-icons calender-icon md-18 hide-elements${darkModeClass}">timer</span></div>\n    <div class = "div8 due-time hide-elements extra-ele">${obj.dueTime}</div>\n    <div class="div9">\n        <span class="arrow-container"><img class="task-arrow-button" src="pics/arrow.png" alt="arrow button"></span>\n    </div>\n    <div class="div10 fade-effect hide-elements extra-ele"><button class="edit-task-btn">Edit</button></div>\n    <div class="div11 fade-effect hide-elements extra-ele">Notes:</div>\n    <div class="div12 task-notes fade-effect hide-elements extra-ele">${obj.notes}</div>`

}


//Adds different header and buttons, depending if user adds or edits task
function addIdentifiersToTaskForm(callback) {
    let formHeader = document.querySelector('.task-form-header');
    let taskFormBtnContainer = document.querySelector('.form-button-cont');
    taskFormBtnContainer.innerHTML = callback(formHeader);
}

const newTaskIdentifiers = formHeader => {
    formHeader.innerHTML = 'Add Task';
    return `<input class="form-button-add add-task-btn form-add fade-effect" type="submit" value="Add"/>
        <input class="form-button-cancel form-cancel fade-effect" type="reset" value="Cancel"/>`
};

function editTaskIdentifiers(formHeader) {
    formHeader.innerHTML = 'Edit Task';
        return `<input class="form-button-edit form-add fade-effect" type="submit" value="Edit"/>
        <input class="form-button-cancel form-cancel fade-effect" type="reset" value="Cancel"/>`;
}



function displayProjectForm(task) {
    projectForm.innerHTML = `<span class="close-project-form">&#10006;</span>
    <h2>${task}</h2><hr class="divider"/>` +
        `<label for="project-name" class="text-label">Project name</label> 
        <br />` +
        `<input class="input-field" maxlength="20" required type="text" id="project-name" name="project-name"/>` +
        `<div class="select-priority-cont">
        <div class="priority-cont"> 
            <input type="radio" name="task-priority" id="priority1" value="priority1"/>` +
        `   <div class="color-code priority1"></div>
            <label for="priority1"> Priority 1</label> 
        </div>` +
        `<div class="priority-cont">
            <input type="radio" name="task-priority" id="priority2" value="priority2"/>` +
        `   <div class="color-code priority2"></div>
            <label for="priority2"> Priority 2</label>
        </div>` +
        `<div class="priority-cont">
            <input type="radio" name="task-priority" id="priority3" value="priority3"/>
            <div class="color-code priority3"></div>` +
        `   <label for="priority3"> Priority 3</label>
        </div>
        <div class="priority-cont">
            <input type="radio" name="task-priority" id="priority4" value="priority4"/>` +
        `   <div class="color-code priority4"></div>
            <label for="priority4"> Priority 4</label>
        </div>
        <div class="priority-cont">` +
        `   <input type="radio" name="task-priority" id="priority5" value="priority5"/>
            <div class="color-code priority5"></div>` +
        `   <label for="priority5"> Priority 5</label>
        </div>
        </div>`;

    if (task === 'Edit project') {
        projectForm.innerHTML += `<input type="button" value="Edit" class="edit-project form-add fade-effect"/>
        <button class="delete-project form-cancel fade-effect" >Delete</button>`;
    } else if (task === 'Add project') {
        projectForm.innerHTML += `<input type="button" value="Add" class="add-project form-add fade-effect"/>
        <input type="reset" value="Cancel" class="cancel-project-form form-cancel fade-effect"/>`;
    }
}

function displayNewProject(obj) {
    let projectFolder = document.querySelector('.project-menu');
    let projectItem = document.createElement('div');
    projectItem.classList.add('project-item');

    projectItem.id = obj.id;

    //Modify projectName, so we can use it as a id, and later we can use the it to open tasks that are in that project. 
    let nameToLower = obj.projectName.toLowerCase();
    nameToLower = nameToLower.replace(/\s+/g, '');

    projectItem.innerHTML = `<div class="color-code ${obj.projectPriority}"></div>
        <p id="${nameToLower}" class="project-name">${obj.projectName}</p></div>
        <span class="settings-icon material-icons">more_vert</span>`;
    projectFolder.appendChild(projectItem);
}



function saveDarkModeToStorage() {
    darkMode = !darkMode;

    if (darkMode) {
        localStorage.setItem("darkMode", true);
    } else {
        localStorage.setItem("darkMode", false);
    }
}

function toggleDarkMode() {
    document.querySelector('.content-container').classList.toggle('dark-mode');
    document.querySelectorAll('.nav-icon').forEach(function (item) {
        item.classList.toggle('dark-mode-icons');
    })
    document.querySelectorAll('.calender-icon').forEach(function (item) {
        item.classList.toggle('dark-mode-icons');
    })
    document.querySelectorAll('.settings-icon').forEach(function (item) {
        item.classList.toggle('dark-mode-icons');
    })

    console.log('darkMode is on? ' + darkMode);
}

function readDarkmodeFromStorage() {
    darkMode = localStorage.getItem('darkMode') === 'true';
    document.getElementById("darkmode-checkbox").checked = darkMode;
    if (darkMode) {
        toggleDarkMode();
    }
}

function changeHeaderIfSmallScreen(type) {
    let intViewportWidth = window.innerWidth;
    if(intViewportWidth < 640) if (type === 'open') {
        document.querySelector('.header-txt').style.opacity = 0;
        document.querySelector('#header-btn').style.opacity = 0;
    } else if (type === 'closed') {
        document.querySelector('.header-txt').style.opacity = 1;
        document.querySelector('#header-btn').style.opacity = 1;
    }
    console.log('screen width is ' + intViewportWidth);
}

function openNav() {
    document.getElementById("side-nav").style.width = "300px";
    docFrame.forEach(section => section.style.marginLeft = "0");
    document.querySelector('.content').style.marginLeft = "0px";
    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 1);
    document.querySelector('#side-btn').style.opacity = 1;
    document.querySelector('.dark-mode-cont').style.opacity = 1;
    if (projectsFolderIsOpen) {
        document.querySelector(".project-menu").classList.toggle("menu-visible");
        document.querySelector('.project-button-cont').classList.toggle("menu-visible");

    }
    if (filterFolderIsOpen) {
        document.querySelector(".filter-menu").classList.toggle("menu-visible");
    }
    changeHeaderIfSmallScreen('open');
}

function closeNav() {
    document.getElementById("side-nav").style.width = "100px";
    docFrame.forEach(section => section.style.marginLeft = "-200px");
    document.querySelector('.content').style.marginLeft = "-200px";
    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 0);
    document.querySelector('#side-btn').style.opacity = 0;
    document.querySelector('.dark-mode-cont').style.opacity = 0;
    if (projectsFolderIsOpen) {
        document.querySelector(".project-menu").classList.toggle("menu-visible");
        document.querySelector('.project-button-cont').classList.toggle("menu-visible");
    }
    if (filterFolderIsOpen) {
        document.querySelector(".filter-menu").classList.toggle("menu-visible");
    }
    changeHeaderIfSmallScreen('closed');
}


//When form is open, background gets filter on, so only form is on focus
function toggleFormBackgroundFilter() {
    document.querySelector('.header').classList.toggle('filter-on');
    document.querySelector('.side-bar').classList.toggle('filter-on');
    document.querySelector('.task-cont-header').classList.toggle('filter-on');
    document.querySelector('.tasks-container').classList.toggle('filter-on');
}

//When user clicks project folder or filter folder, display changes
function toggleFolderDisplay(e) {
    let targetId = e.target.id;
    console.log(targetId);
    if (targetId === 'projects') {
        toggleProjectFolderIndex();
        toggleProjectDisplay();
    } else if (targetId === 'filter') {
        togglePriorityDisplay();
        toggleOpenTaskBtnIndex();
    }
    rotateProjectSpanArrow(targetId);
}

function togglePriorityDisplay() {
    document.querySelector(".filter-menu").classList.toggle("menu-visible");
    document.querySelector(".filter-span").classList.toggle("rotate-span");
}

function toggleProjectDisplay() {
    document.querySelector('.project-button-cont').classList.toggle("menu-visible");
    document.querySelector(".project-menu").classList.toggle("menu-visible");
    document.querySelector(".filter-folder").classList.toggle('filter-margin-top');
}

function toggleProjectFolderIndex() {
    if (!projectsFolderIsOpen) {
        document.querySelector(".project-menu").style.zIndex = 'auto';
        document.querySelector('.project-button-cont').style.zIndex = 'auto';
    } else if (projectsFolderIsOpen) {
        document.querySelector(".project-menu").style.zIndex = '-1';
        document.querySelector('.project-button-cont').style.zIndex = '-1';
    }
}

function toggleOpenTaskBtnIndex() {
    if (!filterFolderIsOpen) {
        document.querySelector(".filter-menu").style.zIndex = 'auto';
    } else if (filterFolderIsOpen) {
        document.querySelector(".filter-menu").style.zIndex = '-1';
    }
}

function rotateProjectSpanArrow(id) {
    if (id === 'projects') {
        let targetElement = document.querySelector(".project-span");
        if (!projectsFolderIsOpen) {
            targetElement.style.transform = 'rotate(-90deg)';
            projectsFolderIsOpen = true;
        } else {
            targetElement.style.transform = 'rotate(0deg)';
            projectsFolderIsOpen = false;
        }
    } else if (id === 'filter') {
        let targetElement = document.querySelector(".filter-span");
        if (!filterFolderIsOpen) {
            targetElement.style.transform = 'rotate(-90deg)';
            filterFolderIsOpen = true;
        } else {
            targetElement.style.transform = 'rotate(0deg)';
            filterFolderIsOpen = false;
        }
    }
}



function toggleTaskCompleteMsgDisplay() {
    document.querySelector('.task-completed-message').style.opacity = 1;
    document.querySelector('.task-completed-message').style.transform = 'translateY(-100px)';
    setTimeout(function () {
        document.querySelector('.task-completed-message').style.transform = 'translateY(0px)';
    }, 3000);
    setTimeout(function () {
        document.querySelector('.task-completed-message').style.opacity = 0;
    }, 3700);
}


export {
    openNav,
    closeNav,
    toggleFolderDisplay,
    displayNewTask,
    displayNewProject,
    displayProjectForm,
    toggleFormBackgroundFilter,
    addIdentifiersToTaskForm,
    getFormattedDate,
    toggleDarkMode,
    readDarkmodeFromStorage,
    saveDarkModeToStorage,
    newTaskIdentifiers,
    editTaskIdentifiers,
    toggleTaskCompleteMsgDisplay,
};