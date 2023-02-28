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
export default (configsDir: string, searchDepth = 1) => {
  const manifests = list(configsDir, searchDepth).map<AppshellManifest>((configPath) => {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration not found at ${configPath}`);
    }

    const config = JSON.parse(fs.readFileSync(configPath).toString());
    const configMap = configmap.create(config);

    return toAppshellManifest(config, configMap);
  });

  return merge(validator, ...manifests);
};
