const k8s = require('@kubernetes/client-node');
const Table = require('easy-table');
const { getNamespaceName, getConfig } = require('../Components/NamespaceV1');
const { sleep } = require('../Helpers/sleep');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const createNamespace = async () => {
  console.log('\x1b[32mCreating namespace\x1b[0m');

  await k8sApi.createNamespace(getConfig());
  console.log('\x1b[33mNamespace was successfully created\x1b[0m');
  console.log();
};

const deleteNamespace = async () => {
  console.log('\x1b[32mDeleting namespace\x1b[0m');

  try {
    const res = await k8sApi.deleteNamespace(getNamespaceName());
    console.log(res.body.status.phase);

    /* eslint-disable no-await-in-loop */
    let completed = false;
    while (!completed) {
      try {
        await k8sApi.readNamespace(getNamespaceName());
        await sleep(500);
      } catch (err) {
        completed = true;
      }
    }
    /* eslint-enable no-await-in-loop */
  } catch (err) {
    console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
  }

  console.log(`\x1b[33mNamespace: ${getNamespaceName()} was successfully deleted\x1b[0m`);
  console.log();
};

const showNamespace = async () => {
  console.log('________ NAMESPACE INFO _________');
  console.log();

  try {
    const res = await k8sApi.readNamespace(getNamespaceName());
    const t = new Table();
    t.cell('Name', res.body.metadata.name);
    t.cell('Labels', Object.values(res.body.metadata.labels));
    t.cell('Status', res.body.status.phase);
    t.newRow();

    console.log(t.toString());
  } catch (err) {
    console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
  }

  console.log();
};

exports.showNamespace = showNamespace;
exports.createNamespace = createNamespace;
exports.deleteNamespace = deleteNamespace;
