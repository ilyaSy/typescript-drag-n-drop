export default class BaseProject {
    constructor(templateId, hostElementId, newElementId) {
        this.templateElement = (document.querySelector(templateId));
        this.hostElement = document.querySelector(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
    }
    render(mode) {
        if (mode === 'start')
            this.hostElement.prepend(this.element);
        if (mode === 'end')
            this.hostElement.append(this.element);
    }
}
//# sourceMappingURL=BaseProject.js.map