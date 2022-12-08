import { V1ConfigMap } from '@kubernetes/client-node';
import Namespace from './Namespace';

export default class ConfigMap {
  public name(): string {
    const ns = new Namespace();
    return `${ns.name()}-configmap`;
  }

  public config(): V1ConfigMap {
    return {
      metadata: {
        name: this.name(),
      },
      data: this.data()
    };
  }

  protected data(): { [key: string]: string } {
    return {};
  }
}
