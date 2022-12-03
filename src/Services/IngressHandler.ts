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
    const res = await k8sNetworking.createNamespacedIngress(ns.name(), ing.config());
  } catch (err) {
    if (err.body.code === 409) {
      const res = await k8sNetworking.replaceNamespacedIngress(ing.name(), ns.name(), ing.config());
    }
  }
};

export { createIngress };