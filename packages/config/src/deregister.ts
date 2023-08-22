/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import chalk from 'chalk';
import fs from 'fs';
import axios from './axios';
import { AppshellGlobalConfig, AppshellManifest } from './types';
import { isValidUrl } from './utils';
import * as validators from './validators';

const removeFromGlobalConfig = (doc: AppshellGlobalConfig, key: string) => {
  if (doc.index[key]) {
    delete doc.index[key];
  } else {
    console.log(chalk.yellow(`index entry not found for '${key}'`));
  }

  if (doc.metadata && doc.metadata[key]) {
    delete doc.metadata[key];
  } else {
    console.log(chalk.yellow(`metadata entry not found for '${key}'`));
  }

  return doc;
};

const removeFromManifest = (doc: AppshellManifest, key: string) => {
  const targetModule = key.split('/')[0];

  if (!doc.remotes[key]) {
    console.log(chalk.yellow(`manifest entry not found for remotes[${key}]`));
  }

  if (!doc.modules[targetModule]) {
    console.log(chalk.yellow(`manifest entry not found for modules[${key}]`));
  }

  if (!doc.environment[targetModule]) {
    console.log(chalk.yellow(`manifest entry not found for environment[${key}]`));
  }

  delete doc.remotes[key];
  delete doc.modules[targetModule];
  delete doc.environment[targetModule];

  return doc;
};

const updateGlobalConfig = (registry: string, key: string) => {
  const file = `${registry}/appshell.config.json`;

  if (!fs.existsSync(file)) {
    console.log(chalk.yellow(`registry file not found ${file}`));
    return;
  }

  const register: AppshellGlobalConfig = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const doc = removeFromGlobalConfig(register, key);

  validators.AppshellGlobalConfigValidator.validate(doc);

  fs.writeFileSync(file, JSON.stringify(doc));
};

const updateSnapshot = (registry: string, key: string) => {
  const file = `${registry}/appshell.snapshot.json`;

  if (!fs.existsSync(file)) {
    console.log(chalk.yellow(`registry file not found ${file}`));
    return;
  }

  const manifest: AppshellManifest = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const doc = removeFromManifest(manifest, key);

  validators.AppshellManifestValidator.validate(doc);

  fs.writeFileSync(file, JSON.stringify(doc));
};

export default async (manifestKey: string, registry: string) => {
  console.log(`deregistering manifest from registry ${registry}`);

  if (isValidUrl(registry)) {
    await axios.delete(registry, { data: { manifestKey } });

    return;
  }

  if (!fs.existsSync(registry)) {
    console.log(chalk.yellow(`registry location not found ${registry}`));
  }

  updateGlobalConfig(registry, manifestKey);
  updateSnapshot(registry, manifestKey);
};
