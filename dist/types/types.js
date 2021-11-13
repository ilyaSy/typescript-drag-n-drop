export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["Active"] = "active";
    ProjectStatus["Finished"] = "finished";
})(ProjectStatus || (ProjectStatus = {}));
export class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
export class State {
    constructor() {
        this.listeners = [];
    }
    addListner(fn) {
        this.listeners.push(fn);
    }
}
//# sourceMappingURL=types.js.map