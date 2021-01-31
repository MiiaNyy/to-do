

let headAndFoot = document.querySelectorAll(".main");

let taskContainer = document.querySelector('.tasks-container');
let projectForm = document.querySelector('.add-project-form');

let projectsFolderIsOpen = false;
let filterFolderIsOpen = false;

let formIsOpen = false;

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
        projectForm.innerHTML += `<input type="submit" value="Edit" class="edit-project"/>
        <button class="delete-project" >Delete project</button>`;
    } else if (task == 'Add project') {
        projectForm.innerHTML += `<input type="submit" value="Add" class="add-project"/>
        <input type="reset" value="Cancel"/>`;
    }
}

function createTaskEditForm() {
    let editForm = document.querySelector('.edit-old-task-form');
    editForm.innerHTML += `<span class="close-form-btn">&#10006;</span>
    <h2>Edit Task</h2>
    <hr class="divider"/>` +
        `<label for="task-name" class="text-label">Task</label>
        <br />` +
        `<input class="input-field" required type="text" id="task-name" name="task-name"/><br/><br/>` +
        
        `<br/><br/>` +
        `<label for="dueDate">Due date</label>` +
        `<input type="date" id="dueDate" name="dueDate">` +
        `<input type="time" name="time" id="time">
        <br/><br/>` +
        `<div class="select-priority-cont"><div class="priority-cont">` +
        `   <input type="radio" name="task-priority" id="priority1" value="priority1"/>` +
        `   <div id="" class="priority1 color-code"></div>` +
        `   <label for="priority1"> Priority 1</label> 
        </div>` +
        `<div class="priority-cont">
            <input type="radio" name="task-priority" id="priority2" value="priority2"/>
            <div class="priority2 color-code"></div>
            <label for="priority2"> Priority 2</label>                            
        </div>` +
        `<div class="priority-cont">
            <input type="radio" name="task-priority" id="priority3" value="priority3"/>
            <div class="priority3 color-code"></div>
            <label for="priority3"> Priority 3</label>                            
        </div>` +
        `<div class="priority-cont">
            <input type="radio" name="task-priority" id="priority4" value="priority4"/>
            <div class="priority4 color-code"></div>
            <label for="priority4"> Priority 4</label>                            
        </div>` +
        `<div class="priority-cont">
            <input type="radio" name="task-priority" id="priority5" value="priority5"/>
            <div class="priority5 color-code"></div>
            <label for="priority5"> Priority 5</label>                            
        </div>  ` +
        `</div> 
        <input type="submit" value="Edit" class="add-edited-task">                      
        <input type="reset" value="Cancel"/>`
}

function toggleTaskFormDisplay() {
    let form = document.querySelector('.task-form');
    if (!formIsOpen) {
        form.style.display = 'block';
        formIsOpen = true;
    } else if (formIsOpen) {
        form.style.display = 'none';
        formIsOpen = false;

    }

}

function openNav() {
    document.getElementById("side-nav").style.width = "300px";
    headAndFoot.forEach(section => section.style.marginLeft = "0");
    document.querySelector('.content').style.marginLeft = "100px";
    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 1);
    document.querySelector('#side-btn').style.opacity = 1;

}

function closeNav() {
    document.getElementById("side-nav").style.width = "100px";
    headAndFoot.forEach(section => section.style.marginLeft = "-200px");
    document.querySelector('.content').style.marginLeft = "-100px";
    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 0);
    document.querySelector('#side-btn').style.opacity = 0;
}

function toggleFolderDisplay(e) {
    let targetId = e.target.id;
    if (targetId == 'projects') {
        document.querySelector('.project-button-cont').classList.toggle("menu-visible");
        document.querySelector(".project-menu").classList.toggle("menu-visible");
        document.querySelector(".filter-folder").classList.toggle('filter-margin-top');

    } else if (targetId == 'filter') {
        document.querySelector(".filter-menu").classList.toggle("menu-visible");
        document.querySelector(".filter-span").classList.toggle("rotate-span")
    }
    rotateProjectSpanArrow(targetId);
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


function displayNewTask(obj) {
    let taskHtml = document.createElement('div');
    taskHtml.classList.add('task', 'fade-effect');
    taskHtml.id = obj.id;
    taskHtml.innerHTML = `<input class="div1 task-completed" type="radio">` +
        `<div class="div2 color-code ${obj.priority}"></div>` +
        `<div class = "div9 task-name" >${obj.name} #${obj.project}</div>` +
        `<div class="div4"><img src="pics/calendar2.png"></div>` +
        `<div class="div5 due-date">${obj.dueDate}</div>` +
        `<div class="div6"><img src="pics/alarm-clock.png"> </div>` +
        `<div class = "div7 due-time" >${obj.dueTime}</div>` +
        `<img class="settings-icon fade-effect" src="pics/settings.png">` +
        `<div class="div3"> </div>`;
        
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






export {
    openNav,
    closeNav,
    toggleFolderDisplay,
    toggleTaskFormDisplay,
    displayNewTask,
    displayNewProject,
    createTaskEditForm,
    displayProjectForm,
};