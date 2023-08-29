import { createMap, createMapper, forMember, mapFrom, mapWithArguments } from '@automapper/core';
import { pojos, PojosMetadataMap } from '@automapper/pojos';
import { entries } from 'lodash';
import configmap from '../configmap';
import {
  AppshellConfigRemote,
  AppshellManifest,
  AppshellRemote,
  AppshellTemplate,
  ConfigMap,
} from '../types';

const mapper = createMapper({
  strategyInitializer: pojos(),
});

function createMetadata() {
  PojosMetadataMap.create<AppshellTemplate>('AppshellTemplate', {});
  PojosMetadataMap.create<AppshellManifest>('AppshellManifest', {});
}

createMetadata();

const mapAppshellEntrypoint = (
  source: AppshellTemplate,
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

const mapRemotes = (source: AppshellTemplate) =>
  entries(source.remotes).reduce((acc, [key, remote]) => {
    acc[key] = mapAppshellEntrypoint(source, key, remote);
    return acc;
  }, {} as Record<string, AppshellRemote>);

createMap<AppshellTemplate, AppshellManifest>(
  mapper,
  'AppshellTemplate',
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
  forMember(
    (destination) => destination.overrides,
    mapFrom((source) => source.overrides),
  ),
);

// eslint-disable-next-line import/prefer-default-export
export const toAppshellManifest = <TMetadata extends Record<string, unknown>>(
  template: AppshellTemplate,
  args: ConfigMap,
) => {
  const manifest = mapper.map<AppshellTemplate, AppshellManifest<TMetadata>>(
    template,
    'AppshellTemplate',
    'AppshellManifest',
  );
  return configmap.apply(manifest, args);
};
