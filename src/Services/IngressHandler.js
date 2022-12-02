const k8s = require('@kubernetes/client-node');
const { getConfig } = require('../Components/IngressV1');
const { getNamespaceName } = require('../Components/NamespaceV1');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sNetworking = kc.makeApiClient(k8s.NetworkingV1Api);

const createIngress = async () => {
  await k8sNetworking.createNamespacedIngress(getNamespaceName(), getConfig());
};

exports.createIngress = createIngress;
