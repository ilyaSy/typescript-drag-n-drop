import BaseProject from "./BaseProject.js";
import { projectState } from "../state/ProjectState.js";
import autobind from "../decorators/autobind.js";

export default class ProjectInput extends BaseProject<HTMLDivElement, HTMLFormElement> {
  titleInputElement;
  descriptionInputElement;
  peopleInputElement;

  constructor() {
    super('#project-input', '#app', 'user-input');

    this.titleInputElement = <HTMLInputElement>(
      this.element.querySelector('#title')
    );
    this.descriptionInputElement = <HTMLInputElement>(
      this.element.querySelector('#description')
    );
    this.peopleInputElement = <HTMLInputElement>(
      this.element.querySelector('#people')
    );

    this.configure();
    this.render('end');
  }

  private getUserInputs(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = this.peopleInputElement.value;

    if (
      !title.trim().length ||
      !description.trim().length ||
      !people.trim().length
    ) {
      alert('Некорректные входные данные!');
      return;
    } else {
      return [title, description, +people];
    }
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInputs();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.add(title, description, people);

      this.clearInputs();
    }
  }
}