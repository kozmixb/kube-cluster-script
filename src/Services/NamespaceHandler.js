const k8s = require('@kubernetes/client-node');
const { getNamespaceName, getConfig } = require('../Components/NamespaceV1');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const createNamespace = async () => {
  try {
    const res = await k8sApi.createNamespace(getConfig());
    console.log(`\x1b[33mNamespace ${getNamespaceName()} is: ${res.body.status.phase}\x1b[0m`);
  } catch (err) {
    if (!err.body.code === 409) {
      throw err;
    }
  }
  console.log();
};

const deleteNamespace = async () => {
  console.log('Deleting namespace');

  try {
    const res = await k8sApi.deleteNamespace(getNamespaceName());
    console.log(res.body.status.phase);
  } catch (err) {
    if (!err.body.code === 404) {
      throw err;
    }
  }
};

exports.createNamespace = createNamespace;
exports.deleteNamespace = deleteNamespace;
