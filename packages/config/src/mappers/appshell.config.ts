import { createMap, createMapper, forMember, mapFrom, mapWithArguments } from '@automapper/core';
import { pojos, PojosMetadataMap } from '@automapper/pojos';
import { entries } from 'lodash';
import configmap from '../configmap';
import {
  AppshellConfig,
  AppshellConfigRemote,
  AppshellManifest,
  AppshellRemote,
  ConfigMap,
} from '../types';

const mapper = createMapper({
  strategyInitializer: pojos(),
});

function createMetadata() {
  PojosMetadataMap.create<AppshellConfig>('AppshellConfig', {});
  PojosMetadataMap.create<AppshellManifest>('AppshellManifest', {});
}

createMetadata();

const mapAppshellEntrypoint = (
  source: AppshellConfig,
  key: string,
  remote: AppshellConfigRemote,
) => {
  const moduleName = key.replace(/\/.+/, '');
  const moduleKey = key.replace(moduleName, '.');
  const { id, url, filename } = remote;
  const { shareScope } = source.module;

  return {
    id,
    manifestUrl: `${url}/appshell.manifest.json`,
    remoteEntryUrl: `${url}/${filename}`,
    scope: moduleName,
    module: moduleKey,
    shareScope,
    metadata: remote.metadata,
  };
};

const mapRemotes = (source: AppshellConfig) =>
  entries(source.remotes).reduce((acc, [key, remote]) => {
    acc[key] = mapAppshellEntrypoint(source, key, remote);
    return acc;
  }, {} as Record<string, AppshellRemote>);

createMap<AppshellConfig, AppshellManifest>(
  mapper,
  'AppshellConfig',
  'AppshellManifest',
  forMember(
    (destination) => destination.remotes,
    mapWithArguments((source) => ({
      ...mapRemotes(source),
    })),
  ),
  forMember(
    (destination) => destination.modules,
    mapFrom((source) => ({ [source.module.name || 'unknown']: source.module })),
  ),
  forMember(
    (destination) => destination.environment,
    mapFrom((source) => source.environment),
  ),
);

// eslint-disable-next-line import/prefer-default-export
export const toAppshellManifest = <TMetadata extends Record<string, unknown>>(
  config: AppshellConfig,
  args: ConfigMap,
) => {
  const manifest = mapper.map<AppshellConfig, AppshellManifest<TMetadata>>(
    config,
    'AppshellConfig',
    'AppshellManifest',
  );
  return configmap.apply(manifest, args);
};
