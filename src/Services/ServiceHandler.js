const k8s = require('@kubernetes/client-node');
const Table = require('easy-table');
const { getNamespaceName } = require('../Components/Namespace');
const { getConfigs } = require('../Components/ServiceV1');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const createServices = async () => {
  console.log('\x1b[32mCreating services\x1b[0m');

  await Promise.all(
    getConfigs().map(async (service) => {
      try {
        await k8sApi.createNamespacedService(getNamespaceName(), service);
        console.log(`\x1b[33mService: ${service.metadata.name} was successfully created\x1b[0m`);
      } catch (err) {
        if (err.body.code === 409) {
          return;
        }

        console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
      }
    }),
  );

  console.log();
};

const listServices = async () => {
  console.log('_______ RUNNING SERVICES ________');
  console.log();

  try {
    const res = await k8sApi.listNamespacedService(getNamespaceName());

    if (res.body.items.length === 0) {
      console.log('\x1b[33mNo services found\x1b[0m');
      console.log();
      return;
    }

    const t = new Table();

    res.body.items.forEach((item) => {
      t.cell('Name', item.metadata.name);
      t.cell('Labels', item.metadata.labels ? Object.values(item.metadata.labels) : '');
      t.cell('Selector', Object.values(item.spec.selector).join(','));
      t.cell('Resource Version', item.metadata.resourceVersion);
      t.cell('External IPs', item.spec.externalIps?.join(','));
      t.cell('Ports', item.spec.ports.map((port) => port.targetPort).join(','));
      t.cell('Type', item.spec.type);
      t.newRow();
    });

    console.log(t.toString());
  } catch (err) {
    console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
  }

  console.log();
};

exports.listServices = listServices;
exports.createServices = createServices;
