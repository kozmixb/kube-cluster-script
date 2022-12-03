import { V1Namespace } from '@kubernetes/client-node';

export default class Namespace {
  public name(): string {
    return process.env.APP_NAMESPACE || 'project';
  }

  public config(): V1Namespace {
    return {
      metadata: {
        name: this.name(),
      },
    };
  }
}
