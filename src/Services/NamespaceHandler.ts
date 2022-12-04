import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';
import Namespace from '../Components/Namespace';

const kc = new KubeConfig;
const ns = new Namespace;
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(CoreV1Api);

const createNamespace = async () => {
  try {
    const res = await k8sApi.createNamespace(ns.config());
    console.log(`\x1b[32mNamespace ${ns.name()} is: ${res.body.status?.phase}\x1b[0m`);
  } catch (err) {
    if (err.body.code !== 409) {
      throw err;
    }
  }
  console.log();
};

const deleteNamespace = async () => {
  console.log('Deleting namespace');

  try {
    const res = await k8sApi.deleteNamespace(ns.name());
    console.log(res.body.status);
  } catch (err) {
    if (err.body.code !== 404) {
      throw err;
    }
    console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
  }
};

export { createNamespace, deleteNamespace }
