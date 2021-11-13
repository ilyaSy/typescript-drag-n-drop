export enum ProjectStatus {
  Active = 'active',
  Finished = 'finished',
}

export type Listener<T> = (items: Array<T>) => void;

export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus // 'active' | 'finished'
  ) {}
}

export class State<T> {
  protected listeners: Array<Listener<T>> = [];

  public addListner(fn: Listener<T>) {
    this.listeners.push(fn);
  }
}