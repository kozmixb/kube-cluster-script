const k8s = require('@kubernetes/client-node');
const Table = require('easy-table');
const config = require('../../config/namespace.json');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const getNamespaceName = () => process.env.APP_NAMESPACE || config.metadata.name;

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
    console.error(err.body.message);
  }

  console.log();
};

exports.getNamespaceName = getNamespaceName;
exports.showNamespace = showNamespace;
