import fs from 'fs';
import axios from './axios';
import { AppshellIndex, AppshellManifest, ConfigValidator } from './types';
import { isValidUrl } from './utils';
import * as validators from './validators';

const remove = {
  index: (file: string, key: string) => {
    const doc: AppshellIndex = JSON.parse(fs.readFileSync(file, 'utf-8'));

    if (!doc[key]) {
      // eslint-disable-next-line no-console
      console.warn(`index entry not found for '${key}'`);
      return doc;
    }

    delete doc[key];

    return doc;
  },
  metadata: (file: string, key: string) => {
    const doc: Record<string, unknown> = JSON.parse(fs.readFileSync(file, 'utf-8'));

    if (!doc[key]) {
      // eslint-disable-next-line no-console
      console.warn(`metadata entry not found for '${key}'`);
      return doc;
    }

    delete doc[key];

    return doc;
  },
  manifest: (file: string, key: string) => {
    const doc: AppshellManifest = JSON.parse(fs.readFileSync(file, 'utf-8'));
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
      console.log(`manifest entry not found for environment[${key}]`);
    }

    delete doc.remotes[key];
    delete doc.modules[targetModule];
    delete doc.environment[targetModule];

    return doc;
  },
};

const updateDocument = (
  registry: string,
  collection: 'index' | 'metadata' | 'manifest',
  key: string,
  validator: ConfigValidator,
) => {
  const file = `${registry}/appshell.${collection}.json`;

  if (!fs.existsSync(file)) {
    // eslint-disable-next-line no-console
    console.warn(`registry file not found ${file}`);
    return;
  }

  const doc = remove[collection](file, key);

  validator.validate(doc);

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

  updateDocument(registry, 'index', manifestKey, validators.appshell_index);
  updateDocument(registry, 'metadata', manifestKey, validators.appshell_metadata);
  updateDocument(registry, 'manifest', manifestKey, validators.merge_manifests);
};
