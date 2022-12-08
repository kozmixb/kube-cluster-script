import { Project } from "../Types/Project";
import ConfigMap from "./ConfigMap"
import Namespace from "./Namespace";

export default class IngressConfigMap extends ConfigMap {
  private projects;
  private namespace;
  
  public constructor(projects: Project[]) {
    super();
    this.projects = projects;
    this.namespace = new Namespace();
  }

  public name(): string {
    return 'tcp-services';
  }

  protected data(): { [key: string]: string; } {
    const data = {};

    this.projects
      .filter((project) => project.port !== 80)
      .forEach((project) => {
        if (project.protocol === 'TCP' || project.protocol === undefined) {
          data[`${project.port}`] = this.value(project);
        }
      });

    return data;
  }

  private value(project: Project): string {
    return `${this.namespace.name()}/${project.subdomain}-service:${project.port}`;
  }
}