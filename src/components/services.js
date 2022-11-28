const k8s = require('@kubernetes/client-node');
const Table = require('easy-table');
const services = require('../../config/services.json');
const { getNamespaceName } = require('./namespace');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const createServices = async () => {
  services.forEach((service) => {
    try {
      k8sApi.createNamespacedService(getNamespaceName(), service);
    } catch (err) {
      if (err.body.code === 409) {
        return;
      }

      console.error(err.body.message);
    }
  });
};

const listServices = async () => {
  console.log('________ RUNNING SERVICES ________');
  console.log();

  try {
    const res = await k8sApi.listNamespacedService(getNamespaceName());

    if (res.body.items.length === 0) {
      console.log('No services found');
      console.log();
      return;
    }

    const t = new Table();

    res.body.items.forEach((item) => {
      t.cell('Name', item.metadata.name);
      t.cell('Labels', item.metadata.labels ? Object.values(item.metadata.labels) : '');
      t.cell('Namespace', item.metadata.namespace);
      t.cell('Resource Version', item.metadata.resourceVersion);
      t.cell('External IPs', item.spec.externalIps?.join(','));
      t.cell('Ports', item.spec.ports.map((port) => port.targetPort).join(','));
      t.cell('Type', item.spec.type);
      t.newRow();
    });

    console.log(t.toString());
  } catch (err) {
    console.log(err.body.message);
  }

  console.log();
};

const initServices = () => {
  createServices();
  listServices();
};

exports.listServices = listServices;
exports.initServices = initServices;
exports.createServices = createServices;
