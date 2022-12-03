import { V1Deployment } from "@kubernetes/client-node";
import { Project } from "../Types/Project"

export default class Deployment {
  private project: Project;

  public constructor(project: Project) {
    this.project = project;
  }

  public name(): string {
    return `${this.project.subdomain}-deployment`;
  }

  public label(): string {
    return `${this.project.subdomain}`;
  }

  public config(): V1Deployment {
    return {
      metadata: {
        name: this.name()
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: this.label()
          }
        },
        template: {
          metadata: {
            labels: {
              app: this.label()
            }
          },
          spec: {
            containers: [
              {
                name: this.project.subdomain,
                image: this.project.image
              }
            ],
            volumes:[]
          }
        }
      }
    }
  }
};
