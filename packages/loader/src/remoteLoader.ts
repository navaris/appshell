import { type AppshellManifest } from '@appshell/config';
import fetchDynamicScript from './fetchDynamicScript';
import loadFederatedComponent from './loadFederatedComponent';

const fetchedScriptCache = new Set<string>();

export default (manifest: AppshellManifest) =>
  async <TComponent>(key: string) => {
    let Component: TComponent;
    const remote = manifest.remotes[key];
    if (!remote) {
      throw new Error(`Remote resource not found in manifest. Expected: ${key}`);
    }

    try {
      const loaded = fetchedScriptCache.has(remote.url) || (await fetchDynamicScript(remote.url));
      if (loaded) {
        fetchedScriptCache.add(remote.url);
        Component = await loadFederatedComponent<TComponent>(
          remote.scope,
          remote.module,
          remote.shareScope,
        );

        return Component;
      }
      return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(`Failed to load component '${key}'. ${err?.toString()}`);
    }
  };
