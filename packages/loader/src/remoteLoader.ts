/* eslint-disable no-underscore-dangle */
import { type AppshellManifest } from '@appshell/config';
import { AppshellGlobalConfig } from 'packages/config/src/types';
import fetchDynamicScript from './fetchDynamicScript';
import loadFederatedComponent from './loadFederatedComponent';

const fetchedScriptCache = new Set<string>();
const fetchedManifestCache = new Map<string, AppshellManifest | undefined>();

const fetchManifest = async (url: string): Promise<AppshellManifest | undefined> => {
  if (fetchedManifestCache.has(url)) {
    return fetchedManifestCache.get(url);
  }

  fetchedManifestCache.set(url, undefined);

  const response = await fetch(url);

  if (response.ok) {
    return response.json();
  }

  const message = await response.text();
  throw new Error(`Failed to get manifest from ${url}. ${message}`);
};

export default (config: AppshellGlobalConfig) =>
  async <TComponent>(key: string) => {
    let Component: TComponent;
    const manifestUrl = config.index[key];
    if (!manifestUrl) {
      throw new Error(`Remote resource not found in registry. Expected: ${key}`);
    }

    try {
      const manifest = await fetchManifest(manifestUrl);

      if (manifest) {
        fetchedManifestCache.set(manifestUrl, manifest);

        const remote = manifest.remotes[key];

        const environment = manifest.environment[remote.scope] || {};
        const overrides =
          (config.overrides?.environment && config.overrides?.environment[remote.scope]) || {};
        window[`__appshell_env__${remote.scope}`] = {
          ...environment,
          ...overrides,
        };

        const loaded =
          fetchedScriptCache.has(remote.remoteEntryUrl) ||
          (await fetchDynamicScript(remote.remoteEntryUrl));
        if (loaded) {
          fetchedScriptCache.add(remote.remoteEntryUrl);
          Component = await loadFederatedComponent<TComponent>(
            remote.scope,
            remote.module,
            remote.shareScope,
          );

          return [Component, manifest] as const;
        }
      }

      return [null, null] as const;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(`Failed to load component '${key}'. ${err?.toString()}`);
    }
  };
