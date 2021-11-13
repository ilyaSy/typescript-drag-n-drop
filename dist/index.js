"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["Active"] = "active";
    ProjectStatus["Finished"] = "finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListner(fn) {
        this.listeners.push(fn);
    }
}
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };
    return adjDescriptor;
}
class BaseProject {
    constructor(templateId, hostElementId, newElementId) {
        this.templateElement = (document.querySelector(templateId));
        this.hostElement = document.querySelector(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
    }
    render(mode) {
        if (mode === 'start')
            this.hostElement.prepend(this.element);
        if (mode === 'end')
            this.hostElement.append(this.element);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    add(title, description, people) {
        const newProject = {
            id: Math.random().toString(),
            title,
            description,
            people,
            status: ProjectStatus.Active,
        };
        this.projects.push(newProject);
        this.listeners.forEach((fn) => {
            fn([...this.projects]);
        });
    }
    moveProject(projectId) {
        this.projects = this.projects
            .map((p) => {
            return p.id === projectId
                ? Object.assign(Object.assign({}, p), { status: p.status === ProjectStatus.Active ? ProjectStatus.Finished : ProjectStatus.Active }) : p;
        });
        this.updateListeners();
    }
    updateListeners() {
        this.listeners.forEach((fn) => {
            fn([...this.projects]);
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ProjectState();
        }
        return this.instance;
    }
}
const projectState = ProjectState.getInstance();
class ProjectItem extends BaseProject {
    constructor(hostId, project) {
        super('#single-project', hostId, project.id);
        this.project = project;
        this.render('end');
        this.configure();
        this.renderContent();
    }
    get persons() {
        return (this.project.people + ' person' + (this.project.people > 1 ? 's' : ''));
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(_) { }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.persons + ' assigned';
        this.element.querySelector('p').textContent = this.project.description;
    }
}
__decorate([
    autobind
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    autobind
], ProjectItem.prototype, "dragEndHandler", null);
class ProjectList extends BaseProject {
    constructor(type) {
        super('#project-list', '#app', `${type}-projects`);
        this.type = type;
        this.assignedProject = [];
        projectState.addListner((projects) => {
            this.assignedProject = projects.filter((p) => p.status.valueOf() === this.type);
            this.renderProjects();
        });
        this.render('end');
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            this.toggleDroppableClass('add');
        }
    }
    dropHandler(event) {
        const projectId = event.dataTransfer.getData('text/plain');
        projectState.moveProject(projectId);
        this.toggleDroppableClass('remove');
        event.preventDefault();
    }
    dragLeaveHandler(_) {
        this.toggleDroppableClass('remove');
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent =
            this.type.toUpperCase() + ' PROJECTS';
    }
    toggleDroppableClass(mode) {
        const listEl = this.element.querySelector('ul');
        if (mode === 'add')
            listEl.classList.add('droppable');
        if (mode === 'remove')
            listEl.classList.remove('droppable');
    }
    renderProjects() {
        const listElement = (document.querySelector(`#${this.type}-project-list`));
        listElement.innerHTML = '';
        this.assignedProject.forEach((p) => {
            new ProjectItem(`#${listElement.id}`, p);
        });
    }
}
__decorate([
    autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dragLeaveHandler", null);
class ProjectInput extends BaseProject {
    constructor() {
        super('#project-input', '#app', 'user-input');
        this.titleInputElement = (this.element.querySelector('#title'));
        this.descriptionInputElement = (this.element.querySelector('#description'));
        this.peopleInputElement = (this.element.querySelector('#people'));
        this.configure();
        this.render('end');
    }
    getUserInputs() {
        const title = this.titleInputElement.value;
        const description = this.descriptionInputElement.value;
        const people = this.peopleInputElement.value;
        if (!title.trim().length ||
            !description.trim().length ||
            !people.trim().length) {
            alert('Некорректные входные данные!');
            return;
        }
        else {
            return [title, description, +people];
        }
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }
    clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.getUserInputs();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectState.add(title, description, people);
            this.clearInputs();
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const input = new ProjectInput();
const activeProject = new ProjectList('active');
const finishedProject = new ProjectList('finished');
console.log(input);
//# sourceMappingURL=index.js.map