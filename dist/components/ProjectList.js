var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import BaseProject from "./BaseProject.js";
import { projectState } from "../state/ProjectState.js";
import autobind from "../decorators/autobind.js";
import ProjectItem from "./ProjectItem.js";
export default class ProjectList extends BaseProject {
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
//# sourceMappingURL=ProjectList.js.map