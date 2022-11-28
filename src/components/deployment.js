const k8s = require('@kubernetes/client-node');
const config = require('../../config/deployment.json');
const pods = require('../../config/pods.json');
const { getNamespaceName } = require('./namespace');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApp = kc.makeApiClient(k8s.AppsV1Api);

const getName = () => config.metadata.name;

const getConfig = () => {
  config.spec.template.spec.containers = pods;
  return config;
};

const deploy = async () => {
  try {
    await k8sApp.readNamespacedDeployment(getName(), getNamespaceName());

    await k8sApp.replaceNamespacedDeployment(getName(), getNamespaceName(), getConfig());
  } catch (err) {
    if (err.body.code === 404) {
      k8sApp.createNamespacedDeployment(getNamespaceName(), getConfig());
      return;
    }

    console.error(err.body.message);
  }
};

exports.deploy = deploy;
