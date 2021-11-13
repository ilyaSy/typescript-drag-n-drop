import { Project } from "../types/types.js";
import BaseProject from "./BaseProject.js";
import { DragTarget } from "../interfaces/drag-n-drop.js";
import { projectState } from "../state/ProjectState.js";
import autobind from "../decorators/autobind.js";
import ProjectItem from "./ProjectItem.js";

export default class ProjectList extends BaseProject<HTMLDivElement, HTMLElement> implements DragTarget {
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