let headAndFoot = document.querySelectorAll(".main");

let taskContainer = document.querySelector('.tasks-container');
let projectForm = document.querySelector('.add-project-form');

let projectsFolderIsOpen = false;
let filterFolderIsOpen = false;





function displayProjectForm(task) {
    projectForm.innerHTML = `<span class="close-form-btn">&#10006;</span>
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

    if (task == 'Edit project') {
        projectForm.innerHTML += `<input type="button" value="Edit" class="edit-project"/>
        <button class="delete-project" >Delete project</button>`;
    } else if (task == 'Add project') {
        projectForm.innerHTML += `<input type="button" value="Add" class="add-project"/>
        <input type="reset" value="Cancel" class="cancel-project-form"/>`;
    }
}






function toggleFormBackgroundFilter() {
    document.querySelector('.header').classList.toggle('filter-on');
    document.querySelector('.side-bar').classList.toggle('filter-on');
    document.querySelector('.task-cont-header').classList.toggle('filter-on');
    document.querySelector('.tasks-container').classList.toggle('filter-on');
}


function openNav() {
    document.getElementById("side-nav").style.width = "300px";
    headAndFoot.forEach(section => section.style.marginLeft = "0");
    document.querySelector('.content').style.marginLeft = "100px";
    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 1);
    document.querySelector('#side-btn').style.opacity = 1;
    if (projectsFolderIsOpen) {
        document.querySelector(".project-menu").classList.toggle("menu-visible");
        document.querySelector('.project-button-cont').classList.toggle("menu-visible");
    }
    if (filterFolderIsOpen) {
        document.querySelector(".filter-menu").classList.toggle("menu-visible");
    }

}

function closeNav() {
    document.getElementById("side-nav").style.width = "100px";
    headAndFoot.forEach(section => section.style.marginLeft = "-200px");
    document.querySelector('.content').style.marginLeft = "-100px";
    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 0);
    document.querySelector('#side-btn').style.opacity = 0;
    if (projectsFolderIsOpen) {
        document.querySelector(".project-menu").classList.toggle("menu-visible");
        document.querySelector('.project-button-cont').classList.toggle("menu-visible");
    }
    if (filterFolderIsOpen) {
        document.querySelector(".filter-menu").classList.toggle("menu-visible");
    }
}


function toggleFolderDisplay(e) {
    let targetId = e.target.id;
    console.log(targetId);
    if (targetId == 'projects') {
        toggleProjectFolderZindex();
        toggleProjectDisplay();
    } else if (targetId == 'filter') {
        togglePriorityDisplay();
        toggleOpenTaskBtnZindex();
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

function toggleProjectFolderZindex() {
    if (!projectsFolderIsOpen) {
        document.querySelector(".project-menu").style.zIndex = 'auto';
        document.querySelector('.project-button-cont').style.zIndex = 'auto';
    } else if (projectsFolderIsOpen) {
        document.querySelector(".project-menu").style.zIndex = '-1';
        document.querySelector('.project-button-cont').style.zIndex = '-1';
    }
}

function toggleOpenTaskBtnZindex() {
    if(!filterFolderIsOpen) {
        document.querySelector(".filter-menu").style.zIndex = 'auto';
    } else if(filterFolderIsOpen) {
        document.querySelector(".filter-menu").style.zIndex = '-1';
    }
}

function rotateProjectSpanArrow(id) {
    if (id == 'projects') {
        let targetElement = document.querySelector(".project-span");
        if (!projectsFolderIsOpen) {
            targetElement.style.transform = 'rotate(-90deg)';
            projectsFolderIsOpen = true;
        } else {
            targetElement.style.transform = 'rotate(0deg)';
            projectsFolderIsOpen = false;
        }
    } else if (id == 'filter') {
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

function getFormatedDate(date) {
    let newDate = date.split('-');
    return `${newDate[2]}.${newDate[1]}.${newDate[0]}`;   
}


function displayNewTask(obj) {
    let date = getFormatedDate(obj.dueDate);

    let taskHtml = document.createElement('div');
    taskHtml.classList.add('task', 'fade-effect');
    taskHtml.id = obj.id;
    taskHtml.innerHTML = `<label class="div1 checkbox-container">
    <input type="checkbox">
    <span class="task-completed checkmark"></span>
    </label>  
    <div class="div2 color-code ${obj.priority}"></div>
    <div class = "div3 task-name" >${obj.name}</div>
    <div class="div4 fade-effect hide-elements extra-ele tasks-project"><p>#${obj.project}</p></div>
    <div class="div5"><img src="pics/calendar2.png"></div>
    <div class="div6 due-date">${date}</div>
    <div class="div7"><img src="pics/alarm-clock.png"> </div>
    <div class = "div8 due-time" >${obj.dueTime}</div>
    <div class="div9"><span ><img class="task-arrow-button fade-effect" src="pics/arrow.png"></span></div>
    <div class="div10 fade-effect hide-elements extra-ele"><button class="edit-task-btn">Edit</button></div>
    <div class="div11 fade-effect hide-elements extra-ele">Notes:</div>
    <div class="div12 task-notes fade-effect hide-elements extra-ele">${obj.notes}</div>`
    taskContainer.appendChild(taskHtml);
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
            <img class="settings-icon fade-effect" src="pics/settings.png">`;
    projectFolder.appendChild(projectItem);
}

function addIdentifyersToTaskForm(submitType) {
    let formHeader = document.querySelector('.task-form-header');
    let taskFormBtnContainer = document.querySelector('.form-button-cont');

    if (submitType == 'add new') {
        formHeader.innerHTML = 'Add Task';

        taskFormBtnContainer.innerHTML = `<input class="form-button-add add-task-btn" type="submit" value="Add"/>
        <input class="form-button-cancel" type="reset" value="Cancel"/>`
    } 
    if(submitType == 'edit') {
        formHeader.innerHTML = 'Edit Task';
        taskFormBtnContainer.innerHTML =`<input class="form-button-edit" type="submit" value="Edit"/>
        <input class="form-button-cancel" type="reset" value="Cancel"/>`;
    }


}



export {
    openNav,
    closeNav,
    toggleFolderDisplay,
    displayNewTask,
    displayNewProject,
    displayProjectForm,
    toggleFormBackgroundFilter,
    addIdentifyersToTaskForm,
    getFormatedDate,
};