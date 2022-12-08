require('dotenv').config();
import { createDeployment } from './Services/DeploymentHandler';
import { createIngress } from './Services/IngressHandler';
import { createNamespace } from './Services/NamespaceHandler';
import { createService } from './Services/ServiceHandler';
import { Project } from './Types/Project';
import { createTcpServiceConfigMap } from './Services/ConfigMapHandler'

const projects:Project[] = require('../config/projects.json');

createNamespace()
  .then(() => Promise.all(
      projects.map(async (project) => await createDeployment(project))
  ))
  .then(() => Promise.all(
      projects.map(async (project) => await createService(project))
  ))
  .then(() => {
      createIngress(projects);
  })
  .then(() => {
    createTcpServiceConfigMap(projects);
  })
  .catch((err) => {
    if (err.body) {
      console.log(err.body);
      console.log();
    }

    console.log(err);
  });
