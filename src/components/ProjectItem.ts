import BaseProject from "./BaseProject.js";
import { Draggable } from "../interfaces/drag-n-drop.js";
import { Project } from "../types/types.js";
import autobind from "../decorators/autobind.js";

export default class ProjectItem extends BaseProject<HTMLUListElement, HTMLLIElement> implements Draggable {
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