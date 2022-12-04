import { CoreV1Api, KubeConfig } from "@kubernetes/client-node";
import Table from 'easy-table';
import Namespace from "../Components/Namespace";
import Service from '../Components/Service';
import { Project } from "../Types/Project";

const kc = new KubeConfig();
const ns = new Namespace();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(CoreV1Api);

const createService = async (project: Project) => {
  const sr = new Service(project);

  try {
    await k8sApi.createNamespacedService(ns.name(), sr.config());
    console.log(`\x1b[32m Creating service ${sr.name()} \x1b[0m`);
  } catch (err) {
    if (err.body.code === 409) {
      await k8sApi.replaceNamespacedService(sr.name(), ns.name(), sr.config());
      console.log(`\x1b[32m Patching service ${sr.name()} \x1b[0m`);
      return;
    }

    throw err;
  }
};

const listServices = async () => {
  console.log('_______ RUNNING SERVICES ________');
  console.log();

  try {
    const res = await k8sApi.listNamespacedService(ns.name());

    if (res.body.items.length === 0) {
      console.log('\x1b[33mNo services found\x1b[0m');
      console.log();
      return;
    }

    const t = new Table();

    res.body.items.forEach((item) => {
      t.cell('Name', item.metadata?.name);
      t.cell('Selector', Object.values(item.spec?.selector || []).join(','));
      t.cell('Ports', item.spec?.ports?.map((port) => port.targetPort).join(','));
      t.cell('Type', item.spec?.type);
      t.newRow();
    });

    console.log(t.toString());
  } catch (err) {
    console.log(`\x1b[31mError: ${err.body.message}\x1b[0m`);
  }

  console.log();
};

export { createService, listServices }
