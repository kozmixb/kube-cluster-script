export interface Project {
  subdomain: string,
  image: string,
  port: number,
  container_port?: number,
  protocol?: string,
  env?: {[key: string]: string}
}
