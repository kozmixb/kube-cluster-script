require('dotenv').config();
import { Project } from "./Types/Project";

const projects:Project[] = require('../config/projects.json');

console.log("System host file");
console.log("Windows: C://Windows/System32/drivers/etc/hosts");
console.log("Mac / Linux: /etc/hosts")
console.log();

projects.forEach((project: Project) => {
  console.log(`127.0.0.1  ${project.subdomain}.${process.env.APP_DOMAIN}`);
});

console.log();