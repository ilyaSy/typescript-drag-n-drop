var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import BaseProject from "./BaseProject.js";
import { projectState } from "../state/ProjectState.js";
import autobind from "../decorators/autobind.js";
export default class ProjectInput extends BaseProject {
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
//# sourceMappingURL=ProjectInput.js.map