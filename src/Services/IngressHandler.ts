import { KubeConfig, NetworkingV1Api } from "@kubernetes/client-node";
import Ingress from "../Components/Ingress";
import Namespace from "../Components/Namespace";
import { Project } from "../Types/Project";

const kc = new KubeConfig();
const ns = new Namespace();
kc.loadFromDefault();
const k8sNetworking = kc.makeApiClient(NetworkingV1Api);

const createIngress = async (projects: Project[]) => {
  const ing = new Ingress(projects);
  
  try {
    await k8sNetworking.createNamespacedIngress(ns.name(), ing.config());
    console.log(`\x1b[32m Creating ingress ${ing.name()} \x1b[0m`);
  } catch (err) {
    if (err.body.code === 409) {
      await k8sNetworking.replaceNamespacedIngress(ing.name(), ns.name(), ing.config());
      console.log(`\x1b[32m Patching ingress ${ing.name()} \x1b[0m`);
    }
  }
};

export { createIngress };