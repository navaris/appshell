import { type AppshellManifest } from '@appshell/config';
import fetchDynamicScript from './fetchDynamicScript';
import loadFederatedComponent from './loadFederatedComponent';

export default (manifest: AppshellManifest) =>
  async <TComponent>(key: string) => {
    let Component: TComponent;
    const remote = manifest.remotes[key];
    if (!remote) {
      throw new Error(`Remote resource not found in manifest. Expected: ${key}`);
    }

    try {
      await fetchDynamicScript(remote.url);
      Component = await loadFederatedComponent<TComponent>(
        remote.scope,
        remote.module,
        remote.shareScope,
      );

      return Component;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(`Failed to load component '${key}'. ${err?.toString()}`);
    }
  };
