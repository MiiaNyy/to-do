let headAndFoot = document.querySelectorAll(".main");
let taskContainer = document.querySelector('.tasks-container');

let projectsFolderIsOpen = false;
let filterFolderIsOpen = false;

let formIsOpen = false;

function toggleTaskFormDisplay() {
    let form = document.querySelector('.task-form');
    if (!formIsOpen) {
        form.style.display = 'block';
        formIsOpen = true;
        console.log('Form is open? ' + formIsOpen);
    } else if (formIsOpen) {
        form.style.display = 'none';
        formIsOpen = false;
        console.log('Form is open? ' + formIsOpen);
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
        document.querySelector(".project-menu").classList.toggle("menu-visible");
        document.querySelector(".filter-folder").classList.toggle('filter-margin-top');

    } else if (targetId == 'filter') {
        document.querySelector(".filter-menu").classList.toggle("menu-visible");
        document.querySelector(".filter-span").classList.toggle("rotate-span")
    }
    rotateProjectSpanArrow(targetId);
    console.log('You clicked ' + targetId);
}

function rotateProjectSpanArrow(id) {
    if (id == 'projects') {
        let targetElement = document.querySelector(".project-span");
        if (!projectsFolderIsOpen) {
            targetElement.style.transform = 'rotate(360deg)';
            projectsFolderIsOpen = true;
        } else {
            targetElement.style.transform = 'rotate(270deg)';
            projectsFolderIsOpen = false;
        }
    } else if (id == 'filter') {
        let targetElement = document.querySelector(".filter-span");
        if (!filterFolderIsOpen) {
            targetElement.style.transform = 'rotate(360deg)';
            filterFolderIsOpen = true;
        } else {
            targetElement.style.transform = 'rotate(270deg)';
            filterFolderIsOpen = false;
        }
    }
}

function displayNewTask(obj) {
    let taskHtml = document.createElement('div');
    taskHtml.classList.add('task', 'fade-effect');
    taskHtml.id = obj.id;
    taskHtml.innerHTML = `<input class=" div1 task-completed" type="radio">` +
        `<div id="${obj.priority}" class="div2 color-code"></div>` +
        `<div class = "div3 task-name" >${obj.name}</div>` +
        `<div class="div4 due-date">${obj.dueDate}</div>` +
        `<div class = "div5 due-time" > at ${obj.dueTime}</div>`;
    taskContainer.appendChild(taskHtml);
}



export {
    openNav,
    closeNav,
    toggleFolderDisplay,
    toggleTaskFormDisplay,
    displayNewTask,

};