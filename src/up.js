require('dotenv').config();
const { createConfigs } = require('./Services/ConfigHandler');
const { createDeployment } = require('./Services/DeploymentHandler');
const { createIngress } = require('./Services/IngressHandler');
const { createNamespace, deleteNamespace } = require('./Services/NamespaceHandler');
const { createServices } = require('./Services/ServiceHandler');

deleteNamespace()
  .catch((err) => {
    if (err.statusCode === 404) return;

    console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
  })
  .then(() => createNamespace())
  .then(() => createConfigs())
  .then(() => createDeployment())
  .then(() => createServices())
  .then(() => createIngress())
  .catch((err) => {
    console.log(err);
  });
