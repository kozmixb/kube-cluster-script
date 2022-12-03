require('dotenv').config();
import { listDeployments } from './Services/DeploymentHandler';
import { listPods } from './Services/PodHandler';
import { listServices } from './Services/ServiceHandler';

listDeployments()
  .then(() => listServices())
  .then(() => listPods())
  .catch((err) => console.log(err));
