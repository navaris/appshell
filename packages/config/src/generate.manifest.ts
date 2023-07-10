/* eslint-disable no-param-reassign */
import fs from 'fs';
import path from 'path';
import configmap from './configmap';
import { toAppshellManifest } from './mappers/appshell.config';
import { AppshellConfig } from './types';

/**
 * Generates an appshell manifest
 * @param configPath path of the appshell config to compile into an appshell manifest
 * @param webpackConfig path of the webpack config
 * @returns an appshell manifest
 */
export default async <TMetadata extends Record<string, unknown>>(configPath: string) => {
  if (!fs.existsSync(configPath)) {
    // eslint-disable-next-line no-console
    console.log(`No config file found '${configPath}'`);

    return null;
  }

  const file = fs.readFileSync(path.resolve(configPath), 'utf-8');
  const template = JSON.parse(file) as AppshellConfig;
  const configMap = configmap.create(template);

  return toAppshellManifest<TMetadata>(template, configMap);
};
