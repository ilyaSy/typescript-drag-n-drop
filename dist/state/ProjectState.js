import { State, ProjectStatus } from "../types/types.js";
export class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    add(title, description, people) {
        const newProject = {
            id: Math.random().toString(),
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
    moveProject(projectId) {
        this.projects = this.projects
            .map((p) => {
            return p.id === projectId
                ? Object.assign(Object.assign({}, p), { status: p.status === ProjectStatus.Active ? ProjectStatus.Finished : ProjectStatus.Active }) : p;
        });
        this.updateListeners();
    }
    updateListeners() {
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
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=ProjectState.js.map