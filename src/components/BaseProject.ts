export default abstract class BaseProject<T extends HTMLElement, U extends HTMLElement> {
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