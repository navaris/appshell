/* eslint-disable no-param-reassign */
import fs from 'fs';
import path from 'path';
import configmap from './configmap';
import { toAppshellManifest } from './mappers/appshell.config';
import { AppshellTemplate } from './types';

/**
 * Generates an appshell manifest
 * @param templatePath path of the appshell manifest template to compile into an appshell manifest
 * @returns an appshell manifest
 */
export default async <TMetadata extends Record<string, unknown>>(templatePath: string) => {
  if (!fs.existsSync(templatePath)) {
    // eslint-disable-next-line no-console
    console.log(`No template file found '${templatePath}'`);

    return null;
  }

  const file = fs.readFileSync(path.resolve(templatePath), 'utf-8');
  const template = JSON.parse(file) as AppshellTemplate;
  const configMap = configmap.create(template);

  return toAppshellManifest<TMetadata>(template, configMap);
};
