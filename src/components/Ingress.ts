import { V1Ingress, V1IngressRule } from "@kubernetes/client-node";
import { Project } from "../Types/Project";
import Namespace from "./Namespace";
import Service from "./Service";

export default class Ingress {
  private projects: Project[];
  private namespace: Namespace;

  public constructor(projects: Project[]) {
    this.projects = projects;
    this.namespace = new Namespace();
  }

  public name(): string {
    return `${this.namespace.name()}-ingress`;
  }

  public config(): V1Ingress {
    return {
      metadata: {
        name: this.name(),
      },
      spec: {
        rules: this.projects.map((project) => this.generateHost(project))
      }
    };
  }

  public domain(): string {
    return process.env.APP_DOMAIN || 'localhost';
  }

  public fullHost(project: Project): string {
    return `${project.subdomain}.${this.domain()}`;
  }

  private generateHost(project: Project): V1IngressRule {
    const sr = new Service(project);

    return {
      host: this.fullHost(project),
      http: {
        paths: [
          {
            path: '/',
            pathType: 'Prefix',
            backend: {
              service: {
                name: sr.name(),
                port: {
                  number: project.port
                }
              }
            }
          }
        ]
      }
    }
  }
}
