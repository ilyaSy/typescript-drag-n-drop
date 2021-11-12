type Project = {
  id?: string,
  title: string,
  description: string,
  people: number
};

class ProjectState {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {

  }

  public add(project: Project) {
    const newProject = {
      ...project,
      id: <string>Math.random().toString(),
    }

    this.projects.push(newProject);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance
  }
}

const projectState = ProjectState.getInstance();

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

class ProjectList {
  templateElement;
  hostElement;
  element;

  constructor(private type: 'active' | 'finished'){
    this.templateElement = <HTMLTemplateElement>(
      document.querySelector('#project-list')
    );
    this.hostElement = <HTMLDivElement>document.querySelector('#app');

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = <HTMLElement>importedNode.firstElementChild;
    this.element.id = `${this.type}-projects`;

    this.render(this.hostElement, this.element);
    this.renderContent(this.type.toUpperCase() + ' PROJECTS');
  }

  private renderContent(title: string) {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = title;
  }

  private render(hostElement: HTMLElement, element: HTMLElement) {
    hostElement.append(element);
  }
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

    this.configure(this.element);
    this.render(this.hostElement, this.element);
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
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      console.log(title, description, people);
      this.clearInputs();
    }
  }

  private configure(element: HTMLElement) {
    element.addEventListener('submit', this.submitHandler);
  }

  private render(hostElement: HTMLElement, element: HTMLElement) {
    hostElement.append(element);
  }
}

const input = new ProjectInput();
const activeProject = new ProjectList('active');
const finishedProject = new ProjectList('finished');
console.log(input);
