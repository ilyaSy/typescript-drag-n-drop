import { autobind } from './decorators';

export default class ProjectInput {
  templateElement;
  hostElement;
  element;
  titleInputElement;
  descriptionInputElement;
  peopleInputElement;

  constructor() {
    this.templateElement = <HTMLTemplateElement>(
      document.querySelector('#project-input')
    );
    this.hostElement = <HTMLDivElement>document.querySelector('#app');

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = <HTMLFormElement>importedNode.firstElementChild;
    this.element.id = 'user-input';

    this.titleInputElement = <HTMLInputElement>(
      this.element.querySelector('#title')
    );
    this.descriptionInputElement = <HTMLInputElement>(
      this.element.querySelector('#description')
    );
    this.peopleInputElement = <HTMLInputElement>(
      this.element.querySelector('#people')
    );

    this.configure(this.element);
    this.render(this.element);
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputElement.value);
  }

  private configure(element: HTMLElement) {
    element.addEventListener('submit', this.submitHandler);
  }

  private render(element: HTMLElement) {
    this.hostElement.prepend(element);
  }
}

// const input = new ProjectInput();
