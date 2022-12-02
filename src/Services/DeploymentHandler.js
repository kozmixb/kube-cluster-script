const k8s = require('@kubernetes/client-node');
const Table = require('easy-table');
const { getConfig } = require('../Components/DeploymentV1');
const { getNamespaceName } = require('../Components/NamespaceV1');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApp = kc.makeApiClient(k8s.AppsV1Api);

const createDeployment = async () => {
  console.log('\x1b[32mCreating deployment\x1b[0m');

  await k8sApp.createNamespacedDeployment(getNamespaceName(), getConfig());

  console.log('\x1b[33mDeployment was successfully created\x1b[0m');
  console.log();
};

const listDeployments = async () => {
  console.log('_______ DEPLOYMENTS ________');
  console.log();

  try {
    const res = await k8sApp.listNamespacedDeployment(getNamespaceName());

    if (res.body.items.length === 0) {
      console.log('\x1b[33mNo deployments found\x1b[0m');
      console.log();
      return;
    }

    const t = new Table();

    res.body.items.forEach((item) => {
      t.cell('Name', item.metadata.name);
      t.cell('Labels', item.metadata.labels ? Object.values(item.metadata.labels) : '');
      t.cell('Replicas', item.spec.replicas);
      t.cell('Strategy', item.spec.strategy.type);
      t.cell('Match labels', Object.values(item.spec.selector.matchLabels).join(','));
      t.newRow();
    });

    console.log(t.toString());
  } catch (err) {
    console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
  }

  console.log();
};

exports.createDeployment = createDeployment;
exports.listDeployments = listDeployments;
