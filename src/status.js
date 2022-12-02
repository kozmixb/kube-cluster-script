require('dotenv').config();
const { listConfigs } = require('./Services/ConfigHandler');
const { listDeployments } = require('./Services/DeploymentHandler');
const { showNamespace } = require('./Services/NamespaceHandler');
const { listPods } = require('./Services/PodHandler');
const { listServices } = require('./Services/ServiceHandler');

showNamespace()
  .then(() => listConfigs())
  .then(() => listServices())
  .then(() => listDeployments())
  .then(() => listPods())
  .catch((err) => console.log(err));
