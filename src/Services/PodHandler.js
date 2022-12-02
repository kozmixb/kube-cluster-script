const k8s = require('@kubernetes/client-node');
const Table = require('easy-table');
const { getNamespaceName } = require('../Components/NamespaceV1');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const listPods = async () => {
  console.log('_______ RUNNING PODS ________');
  console.log();

  try {
    const res = await k8sApi.listNamespacedPod(getNamespaceName());

    if (res.body.items.length === 0) {
      console.log('\x1b[33mNo pods found\x1b[0m');
      console.log();
      return;
    }

    const t = new Table();

    res.body.items.forEach((item) => {
      t.cell('Name', item.metadata.name);
      t.cell('Labels', item.metadata.labels ? Object.values(item.metadata.labels) : '');
      t.cell('Volumes', item.spec.volumes.map((volume) => volume.name).join(','));
      t.newRow();

      item.spec.containers.forEach((container) => {
        t.cell('Name', container.name);
        t.cell('Labels', container.labels ? Object.values(container.labels) : '');
        t.cell('Image', container.image);
        t.cell('Ports', container.ports.map((port) => port.containerPort));
        t.newRow();
      });
    });

    console.log(t.toString());
  } catch (err) {
    console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
  }

  console.log();
};

exports.listPods = listPods;
