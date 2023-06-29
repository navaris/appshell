import fs from 'fs';
import configmap from './configmap';
import { toAppshellManifest } from './mappers/appshell.config';
import { AppshellManifest } from './types';
import { list, merge } from './utils';
import validator from './validators/appshell.manifest';

/**
 * Compiles all configuration into an appshell manifest
 * @param configsDir directory of configs to compile into an appshell manifest
 * @param searchDepth depth to which app configs should be searched in configsDir
 * @returns an appshell manifest
 */
export default <TMetadata extends Record<string, unknown>>(configsDir: string, searchDepth = 1) => {
  const manifests = list(configsDir, searchDepth, /\.json$/i).map<AppshellManifest<TMetadata>>(
    (configPath) => {
      if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration not found at ${configPath}`);
      }

      const config = JSON.parse(fs.readFileSync(configPath).toString());
      const configMap = configmap.create(config);

      return toAppshellManifest<TMetadata>(config, configMap);
    },
  );

  if (!manifests.length) {
    // eslint-disable-next-line no-console
    console.log(`No config files found in '${configsDir}'`);

    return { remotes: {}, modules: {} };
  }

  return merge<AppshellManifest<TMetadata>>(validator, ...manifests);
};
