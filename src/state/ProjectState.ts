import { Project, State, ProjectStatus } from "../types/types.js";

export class ProjectState extends State<Project> {
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

export const projectState = ProjectState.getInstance();