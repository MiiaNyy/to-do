import {
    TodoItem
} from "./classes";

import {
    displayNewTask
} from "./dom";


let taskForm = document.querySelector('.task-form');
let tasks = [];

function openFormWithObjValues(event) {
    let element = event.target;
    let parentId = element.parentNode.id;

    let formElements = taskForm.elements;

    let taskId;

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (task.id == parentId) {
            taskId = task.id;
            for (let j = 0; j < formElements.length; j++) {
                let eleName = formElements[j].name;
                switch (eleName) {
                    case 'task-name':
                        formElements[j].value = task.name;
                        break;
                    case 'project':
                        formElements[j].value = task.project;
                        break;
                    case 'dueDate':
                        formElements[j].value = task.dueDate;
                        break;
                    case 'time':
                        formElements[j].value = task.dueTime;
                        break;
                    case 'task-priority':
                        if (formElements[j].id == task.priority) {
                            formElements[j].checked = true;
                        }
                        break;
                }

            }
        }
    }
    document.querySelector('.add-edited-task').style.display = 'block';
    document.querySelector('.add-task-btn').style.display = 'none';
    taskForm.style.display = 'block';
    return taskId;
}

function getEditedValuesFromForm(form, id) {
    let data = new FormData(form);
    let taskName;
    let projectName;
    let dueDate;
    let dueTime;
    let taskPriority;

    for (const entry of data) {
        switch (entry[0]) {
            case 'task-name':
                taskName = entry[1];
                break;
            case 'project':
                projectName = entry[1];
                break;
            case 'dueDate':
                dueDate = entry[1];
                break;
            case 'time':
                dueTime = entry[1];
                break;
            case 'task-priority':
                taskPriority = entry[1];
                break;
        }
    }
    return changeOldTaskObjValues(id, taskName, projectName, dueDate, dueTime, taskPriority)

}

function changeOldTaskObjValues(id, name, project, duedate, duetime, priority) {
    let obj;
    for (let i = 0; i < tasks.length; i++) {

        let element = tasks[i];
        console.log('task before editing it ' + element.name);
        if (element.id == id) {
            obj = tasks[i];
            element.name = name;
            element.project = project;
            element.dueDate = duedate;
            element.dueTime = duetime;
            element.priority = priority;
        }
        console.log('task after editing it ' + element.name);
    }
    return obj;
}

function editOldTask(form, id) {

    let obj = getEditedValuesFromForm(form, id);
    console.log(obj);



    let item = document.getElementById(id);
    let childElements = item.children;
    console.log(childElements.length);
    for (let i = 0; i < childElements.length; i++) {
        const e = childElements[i];
        const eNames = e.classList;
        console.log(eNames);
        for (let j = 0; j < eNames.length; j++) {
            switch (eNames[j]) {
                case 'task-name':
                    e.innerHTML = obj.name;
                    break;
                case 'due-date':
                    e.innerHTML = obj.dueDate;
                    break;
                case 'due-time':
                    e.innerHTML = obj.dueTime;
                    break;
                case 'color-code':
                    //Because class name priority is always on the last item on the divs classlist
                    let elementsPriority = eNames[2];
                    e.classList.remove(elementsPriority);
                    e.classList.add(obj.priority);
                    break;
            }


        }


    }

    saveTasksToStorage();
}

function makeNewTask(form) {
    let data = new FormData(form);
    let newTask = getNewTask(data);
    displayNewTask(newTask);
    tasks.push(newTask);
    saveTasksToStorage();
    console.log('There are ' + tasks.length + ' tasks in the tasks array');
}

function removeTaskFromView(event) {
    let element = event.target;

    let parentId = element.parentNode.id;
    document.getElementById(parentId).style.opacity = 0;
    setTimeout(function () {
        document.getElementById(parentId).remove();
        console.log('task is now removed from view');
    }, 900);

    console.log("Task completed button clicked");


}

function removeTaskObjWhenComplete(event) {
    console.log('tasks arrays length is ' + tasks.length + ' before removing obj');
    let element = event.target;
    console.log('removing task from obj elements name is ' + element);
    let parentId = element.parentNode.id;
    if (tasks.length > 0) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id == parentId) {
                tasks.splice(i, 1);
                saveTasksToStorage();
                console.log('Removed task named ' + tasks[i].name + '. tasks length is now ' + tasks.length);
            }
        }
    }
}

function displayTasks() {
    for (let i = 0; i < tasks.length; i++) {
        displayNewTask(tasks[i]);
    }
}


function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


//pulls tasks from local storage when page is refreshed
function readTasksFromStorage() {

    // gets information from local storage to use in displayBooks to create display
    let tasksJson = localStorage.getItem('tasks');

    if (tasksJson != null && tasksJson.length > 0) {
        //parses a JSON string to 'normal' value, number to integar yms.
        tasks = JSON.parse(tasksJson);
    }
    /*else {
           //If storage is empty, generoi this book to the page
            addNewBook('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 310, 'read', false);
    }*/
}

function getNewTask(data) {
    let taskName;
    let projectName;
    let dueDate;
    let dueTime;
    let taskPriority;

    for (const entry of data) {
        switch (entry[0]) {
            case 'task-name':
                taskName = entry[1];
                break;
            case 'project':
                projectName = entry[1];
                break;
            case 'dueDate':
                dueDate = entry[1];
                break;
            case 'time':
                dueTime = entry[1];
                break;
            case 'task-priority':
                taskPriority = entry[1];
                break;
        }
    }
    return new TodoItem(taskName, dueDate, dueTime, projectName, taskPriority);
}

export {
    readTasksFromStorage,
    displayTasks,
    makeNewTask,
    removeTaskFromView,
    removeTaskObjWhenComplete,
    openFormWithObjValues,
    editOldTask,
}