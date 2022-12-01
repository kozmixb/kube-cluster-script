const k8s = require('@kubernetes/client-node');
const { getNamespaceName } = require('../Components/NamespaceV1');
const { getConfigs } = require('../Components/ConfigMapV1');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const createConfigs = async () => {
  console.log('\x1b[32mCreating configs\x1b[0m');

  await Promise.all(
    getConfigs().map(async (config) => {
      await k8sApi.createNamespacedConfigMap(getNamespaceName(), config);
      console.log(`\x1b[33mConfig: ${config.metadata.name} was successfully created\x1b[0m`);
    }),
  );

  console.log();
};

exports.createConfigs = createConfigs;
