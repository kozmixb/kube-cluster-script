export interface Project {
  subdomain: string,
  image: string,
  port: number,
  env?: {[key: string]: string}
}
