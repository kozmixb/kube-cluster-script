import { V1Service } from "@kubernetes/client-node";
import { Project } from "../Types/Project";

export default class Service {
  private project: Project;

  public constructor(project: Project) {
    this.project = project;
  }

  public name(): string {
    return `${this.project.subdomain}-service`;
  }

  public label(): string {
    return `${this.project.subdomain}`;
  }

  public config(): V1Service {
    return {
      metadata: {
        name: this.name(),
      },
      spec: {
        selector: {
          app: this.label()
        },
        ports: [
          {
            protocol: this.protocol(),
            port: this.project.port,
            targetPort: this.project.container_port || this.project.port,
            name: this.project.subdomain
          }
        ]
      }
    };
  }

  public protocol(): string {
    return this.project.protocol || 'TCP';
  }
}