import { CoreV1Api, KubeConfig } from "@kubernetes/client-node";
import IngressConfigMap from "../Components/IngressConfigMap";
import { Project } from "../Types/Project";

const kc = new KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(CoreV1Api);

const createTcpServiceConfigMap = async (projects: Project[]) => {
  const cm = new IngressConfigMap(projects);
  
  try {
    await k8sApi.createNamespacedConfigMap('ingress-nginx', cm.config());
    console.log(`\x1b[32m Creating configmap ${cm.name()} \x1b[0m`);
  } catch (err) {
    if (err.body.code === 409) {
      await k8sApi.replaceNamespacedConfigMap(cm.name(), 'ingress-nginx', cm.config());
      console.log(`\x1b[32m Patching configmap ${cm.name()} \x1b[0m`);
    }
  }
};

export { createTcpServiceConfigMap };