import { v4 as uuidv4 } from 'uuid';

class TodoProject {
    constructor(projectName, projectPriority) {
        this.projectName = projectName;
        this.projectPriority = projectPriority;
        this.id = uuidv4();
        this.nameToLower = projectName.toLowerCase();
    }

    get toLower() {
        return this.nameToLower.replace(/\s+/g, '');
    }

    set toLower(value) {
        this.nameToLower = value.toLowerCase();
    }

    get name() {
        return this.projectName;
    }

    set name(value) {
        this.projectName = value;
    }


    get priority() {
        return this.projectPriority;
    }

    set priority(value) {
        this.projectPriority = value;
    }
}

class TodoItem {
    constructor(name, dueDate, dueTime, project, priority, notes) {
        this.name = name;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.project = project;
        this.priority = priority;
        this.notes = notes;
        this.id = uuidv4();
        this.containerOpen = false;
    }


    get projectName() {
        return this.project.nameToLower
    }
    
    get projectPriority() {
        return this.project.priority
    }
}

export {TodoProject, TodoItem};