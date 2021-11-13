enum ProjectStatus {
  Active = 'active',
  Finished = 'finished',
}

interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

type Listener<T> = (items: Array<T>) => void;

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus // 'active' | 'finished'
  ) {}
}

class State<T> {
  protected listeners: Array<Listener<T>> = [];

  public addListner(fn: Listener<T>) {
    this.listeners.push(fn);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////// Decorators
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    },
  };
  return adjDescriptor;
}

//////////////////////////////////////////////////////////////////////////////////////////// BaseProject
abstract class BaseProject<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    newElementId?: string
  ) {
    this.templateElement = <HTMLTemplateElement>(
      document.querySelector(templateId)!
    );
    this.hostElement = <T>document.querySelector(hostElementId)!;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = <U>importedNode.firstElementChild;
    if (newElementId) {
      this.element.id = newElementId;
    }
  }

  protected render(mode: 'start' | 'end') {
    if (mode === 'start') this.hostElement.prepend(this.element);
    if (mode === 'end') this.hostElement.append(this.element);
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

//////////////////////////////////////////////////////////////////////////////////////////// ProjectState
class ProjectState extends State<Project> {
  private projects: Array<Project> = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  public add(
    title: string,
    description: string,
    people: number
    // status?: ProjectStatus
  ) {
    const newProject: Project = {
      id: <string>Math.random().toString(),
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

  public moveProject(projectId: string) {
    this.projects = this.projects
      .map((p) => {
        return p.id === projectId
        ? {
          ...p,
          status: p.status === ProjectStatus.Active ? ProjectStatus.Finished : ProjectStatus.Active
        } : p
      });

    this.updateListeners();
  }

  private updateListeners() {
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

//////////////////////////////////////////////////////////////////////////////////////////// ProjectItem
class ProjectItem extends BaseProject<HTMLUListElement, HTMLLIElement> implements Draggable {
  get persons(): string {
    return (
      this.project.people + ' person' + (this.project.people > 1 ? 's' : '')
    );
  }

  constructor(hostId: string, private project: Project) {
    super('#single-project', hostId, project.id);

    this.render('end');
    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @autobind
  dragEndHandler(_: DragEvent) {}

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////// ProjectList
class ProjectList extends BaseProject<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProject: Project[] = [];

  constructor(private type: 'active' | 'finished') {
    super('#project-list', '#app', `${type}-projects`);

    projectState.addListner((projects: Project[]) => {
      this.assignedProject = projects.filter(
        (p) => p.status.valueOf() === this.type
      );
      this.renderProjects();
    });
    this.render('end');
    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      this.toggleDroppableClass('add');
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(projectId);
    this.toggleDroppableClass('remove');
    
    event.preventDefault();
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    this.toggleDroppableClass('remove');
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
  }

  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private toggleDroppableClass(mode: string) {
    const listEl = this.element.querySelector('ul')!;
    // listEl.classList.remove('droppable');
    if (mode === 'add') listEl.classList.add('droppable')
    if (mode === 'remove') listEl.classList.remove('droppable');
  }

  private renderProjects() {
    const listElement = <HTMLUListElement>(
      document.querySelector(`#${this.type}-project-list`)!
    );
    listElement.innerHTML = '';
    this.assignedProject.forEach((p) => {
      new ProjectItem(`#${listElement.id}`, p);
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////////////// ProjectInput
class ProjectInput extends BaseProject<HTMLDivElement, HTMLFormElement> {
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

//////////////////////////////////////////////////////////////////////////////////////////// MAIN
const input = new ProjectInput();
const activeProject = new ProjectList('active');
const finishedProject = new ProjectList('finished');
console.log(input);
