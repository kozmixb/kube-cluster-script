require('dotenv').config();
import { createDeployment } from './Services/DeploymentHandler';
import { createNamespace } from './Services/NamespaceHandler';
import { Project } from './Types/Project';

const projects:Project[] = require('../config/projects.json');

createNamespace()
  .then(() => {
    Promise.all(
      projects.map(async (project) => await createDeployment(project))
    );
  })
  .catch((err) => {
    if (err.body) {
      console.log(err.body);
      console.log();
    }

    console.log(err);
  });
