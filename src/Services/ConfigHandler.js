const k8s = require('@kubernetes/client-node');
const Table = require('easy-table');
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

const listConfigs = async () => {
  console.log('_______ ACTIVE CONFIGS ________');
  console.log();

  const res = await k8sApi.listNamespacedConfigMap(getNamespaceName());

  if (res.body.items.length === 0) {
    console.log('\x1b[33mNo configs found\x1b[0m');
    console.log();
    return;
  }

  const t = new Table();

  res.body.items.forEach((item) => {
    t.cell('Name', item.metadata.name);
    t.cell('Labels', item.metadata.labels);
    t.cell('Keys', Object.keys(item.data).join(','));
    t.newRow();
  });

  console.log(t.toString());
  console.log();
};

exports.createConfigs = createConfigs;
exports.listConfigs = listConfigs;
