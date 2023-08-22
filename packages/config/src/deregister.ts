/* eslint-disable no-param-reassign */
import fs from 'fs';
import axios from './axios';
import { AppshellManifest, AppshellRegister } from './types';
import { isValidUrl } from './utils';
import * as validators from './validators';

const removeFromRegister = (doc: AppshellRegister, key: string) => {
  if (doc.index[key]) {
    delete doc.index[key];
  } else {
    // eslint-disable-next-line no-console
    console.warn(`index entry not found for '${key}'`);
  }

  if (doc.metadata && doc.metadata[key]) {
    delete doc.metadata[key];
  } else {
    // eslint-disable-next-line no-console
    console.warn(`metadata entry not found for '${key}'`);
  }

  return doc;
};

const removeFromManifest = (doc: AppshellManifest, key: string) => {
  const targetModule = key.split('/')[0];

  if (!doc.remotes[key]) {
    // eslint-disable-next-line no-console
    console.warn(`manifest entry not found for remotes[${key}]`);
  }

  if (!doc.modules[targetModule]) {
    // eslint-disable-next-line no-console
    console.warn(`manifest entry not found for modules[${key}]`);
  }

  if (!doc.environment[targetModule]) {
    // eslint-disable-next-line no-console
    console.warn(`manifest entry not found for environment[${key}]`);
  }

  delete doc.remotes[key];
  delete doc.modules[targetModule];
  delete doc.environment[targetModule];

  return doc;
};

const updateRegister = (registry: string, key: string) => {
  const file = `${registry}/appshell.register.json`;

  if (!fs.existsSync(file)) {
    // eslint-disable-next-line no-console
    console.warn(`registry file not found ${file}`);
    return;
  }

  const register: AppshellRegister = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const doc = removeFromRegister(register, key);

  validators.appshell_register.validate(doc);

  fs.writeFileSync(file, JSON.stringify(doc));
};

const updateManifest = (registry: string, key: string) => {
  const file = `${registry}/appshell.manifest.json`;

  if (!fs.existsSync(file)) {
    // eslint-disable-next-line no-console
    console.warn(`registry file not found ${file}`);
    return;
  }

  const manifest: AppshellManifest = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const doc = removeFromManifest(manifest, key);

  validators.merge_manifests.validate(doc);

  fs.writeFileSync(file, JSON.stringify(doc));
};

export default async (manifestKey: string, registry: string) => {
  // eslint-disable-next-line no-console
  console.log(`deregistering manifest from registry ${registry}`);

  if (isValidUrl(registry)) {
    await axios.delete(registry, { data: { manifestKey } });

    return;
  }

  if (!fs.existsSync(registry)) {
    // eslint-disable-next-line no-console
    console.warn(`registry location not found ${registry}`);
  }

  updateRegister(registry, manifestKey);
  updateManifest(registry, manifestKey);
};
