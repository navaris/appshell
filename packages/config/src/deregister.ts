/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import chalk from 'chalk';
import fs from 'fs';
import axios from './axios';
import { AppshellGlobalConfig, AppshellManifest } from './types';
import { isValidUrl } from './utils';
import * as validators from './validators';

const getModuleName = (key: string) => key.split('/')[0];

const removeFromGlobalConfig = (doc: AppshellGlobalConfig, targetModule: string) => {
  const indexKeys = Object.keys(doc.index).filter((key) => getModuleName(key) === targetModule);
  const metadataKeys = Object.keys(doc.metadata || {}).filter(
    (key) => getModuleName(key) === targetModule,
  );

  if (indexKeys.length) {
    indexKeys.forEach((key) => {
      delete doc.index[key];
    });
  } else {
    console.log(chalk.yellow(`index entry not found for '${targetModule}/*'`));
  }

  if (doc.metadata && metadataKeys.length) {
    metadataKeys.forEach((key) => {
      if (doc.metadata) {
        delete doc.metadata[key];
      }
    });
  } else {
    console.log(chalk.yellow(`metadata entry not found for '${targetModule}/*'`));
  }

  if (doc.overrides?.environment && doc.overrides.environment[targetModule]) {
    delete doc.overrides.environment[targetModule];
  } else {
    console.log(`no environment override for '${targetModule}'`);
  }

  return doc;
};

const removeFromManifest = (doc: AppshellManifest, targetModule: string) => {
  const remotes = Object.keys(doc.remotes).filter((key) => getModuleName(key) === targetModule);

  if (!remotes.length) {
    console.log(chalk.yellow(`manifest entry not found for remotes[${targetModule}/*]`));
  }

  if (!doc.modules[targetModule]) {
    console.log(chalk.yellow(`manifest entry not found for modules[${targetModule}]`));
  }

  if (!doc.environment[targetModule]) {
    console.log(chalk.yellow(`manifest entry not found for environment[${targetModule}]`));
  }

  remotes.forEach((key) => {
    delete doc.remotes[key];
  });
  delete doc.modules[targetModule];
  delete doc.environment[targetModule];

  return doc;
};

const updateGlobalConfig = (registry: string, targetModule: string) => {
  const file = `${registry}/appshell.config.json`;

  if (!fs.existsSync(file)) {
    console.log(chalk.yellow(`registry file not found ${file}`));
    return;
  }

  const config: AppshellGlobalConfig = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const doc = removeFromGlobalConfig(config, targetModule);

  validators.AppshellGlobalConfigValidator.validate(doc);

  fs.writeFileSync(file, JSON.stringify(doc));
};

const updateSnapshot = (registry: string, targetModule: string) => {
  const file = `${registry}/appshell.snapshot.json`;

  if (!fs.existsSync(file)) {
    console.log(chalk.yellow(`registry file not found ${file}`));
    return;
  }

  const snapshot: AppshellManifest = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const doc = removeFromManifest(snapshot, targetModule);

  validators.AppshellManifestValidator.validate(doc);

  fs.writeFileSync(file, JSON.stringify(doc));
};

export default async (moduleName: string, registry: string) => {
  console.log(`deregistering manifest from registry ${registry}`);

  if (isValidUrl(registry)) {
    await axios.delete(registry, { data: { moduleName } });

    return;
  }

  if (!fs.existsSync(registry)) {
    console.log(chalk.yellow(`registry location not found ${registry}`));
  }

  updateGlobalConfig(registry, moduleName);
  updateSnapshot(registry, moduleName);
};
