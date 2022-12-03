import { KubeConfig, AppsV1Api, V1Deployment } from '@kubernetes/client-node';
import Deployment from '../Components/Deployment';
import Namespace from '../Components/Namespace';
import Table from 'easy-table';
import { Project } from '../Types/Project';


const kc = new KubeConfig();
const ns = new Namespace;
kc.loadFromDefault();
const k8sApp = kc.makeApiClient(AppsV1Api);

const createDeployment = async (project: Project) => {
  const dp = new Deployment(project);

  try {
    const res = await k8sApp.createNamespacedDeployment(ns.name(), dp.config());
    outputResponse(res.body);
  } catch (err) {
    if (err.body.code === 409) {
      const res = await k8sApp.replaceNamespacedDeployment(dp.name(), ns.name(), dp.config());
      outputResponse(res.body);
      return;
    }

    throw err;
  }
};

const listDeployments = async () => {
  console.log('_______ DEPLOYMENTS ________');
  console.log();

  try {
    const res = await k8sApp.listNamespacedDeployment(ns.name());

    if (res.body.items.length === 0) {
      console.log('\x1b[33mNo deployments found\x1b[0m');
      console.log();
      return;
    }

    const t = new Table();

    res.body.items.forEach((item: V1Deployment) => {
      t.cell('Name', item.metadata?.name);
      t.cell('Labels', item.metadata?.labels ? Object.values(item.metadata.labels) : '');
      t.cell('Replicas', item.spec?.replicas);
      t.cell('Strategy', item.spec?.strategy?.type);
      t.cell('Match labels', Object.values(item.spec?.selector.matchLabels || []).join(','));
      t.newRow();
    });

    console.log(t.toString());
  } catch (err) {
    console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
  }

  console.log();
};

const outputResponse = (body: V1Deployment) => {
  const getLastStatus = body.status?.conditions?.slice(-1)[0].message || 'undefined';
  console.log(`\x1b[32m ${getLastStatus} \x1b[0m`);
} 

export {createDeployment, listDeployments};
