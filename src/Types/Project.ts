export interface Project {
  subdomain: string,
  image: string,
  port: number,
  protocol?: string,
  env?: {[key: string]: string}
}
