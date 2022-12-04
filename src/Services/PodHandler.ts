import { CoreV1Api, KubeConfig } from '@kubernetes/client-node';
import Table from 'easy-table';
import Namespace from '../Components/Namespace';

const kc = new KubeConfig();
const ns = new Namespace();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(CoreV1Api);

const listPods = async () => {
  console.log('_______ RUNNING PODS ________');
  console.log();

  try {
    const res = await k8sApi.listNamespacedPod(ns.name());

    if (res.body.items.length === 0) {
      console.log('\x1b[33mNo pods found\x1b[0m');
      console.log();
      return;
    }

    const t = new Table();

    res.body.items.forEach((item) => {
      t.cell('Name', item.metadata?.name);
      t.cell('Labels', item.metadata?.labels ? Object.values(item.metadata.labels) : '');
      t.cell('Volumes', item.spec?.volumes?.map((volume) => volume.name).join(','));
      t.newRow();
    });

    console.log(t.toString());
  } catch (err) {
    console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
  }

  console.log();
};

export { listPods };
