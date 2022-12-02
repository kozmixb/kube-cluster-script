const deployment = require('../../templates/deployment.json');
const pods = require('../../templates/pods.json');
const volumes = require('../../templates/volumes.json');

const getDeploymentName = () => deployment.metadata.name;

const getConfig = () => {
  deployment.spec.template.spec.containers = pods;
  deployment.spec.template.spec.volumes = volumes;
  return deployment;
};

exports.getConfig = getConfig;
exports.getDeploymentName = getDeploymentName;
