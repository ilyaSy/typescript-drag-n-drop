function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
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

    this.clearInputs();
    this.configure(this.element);
    this.render(this.element);
  }

  private getUserInputs(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = this.peopleInputElement.value;

    if (!title.trim().length || !description.trim().length || !people.trim().length) {
      alert('Некорректные входные данные!');
      return;
    } else {
      return [title, description, +people]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInputs();
    // console.log(this.titleInputElement.value);
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
    }
  }

  private configure(element: HTMLElement) {
    element.addEventListener('submit', this.submitHandler);
  }

  private render(element: HTMLElement) {
    this.hostElement.prepend(element);
  }
}

const input = new ProjectInput();
console.log(input);
