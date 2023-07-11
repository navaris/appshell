import fs from 'fs';
import axios from './axios';
import { AppshellManifest, ConfigValidator } from './types';
import { isValidUrl, merge } from './utils';
import * as validators from './validators';

const updateDocument = (file: string, data: object, validator: ConfigValidator) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(data));
    return;
  }

  const doc = JSON.parse(fs.readFileSync(file, 'utf-8'));
  fs.writeFileSync(file, JSON.stringify(merge(validator, doc, data)));
};

export default async (manifest: AppshellManifest, registry: string) => {
  // eslint-disable-next-line no-console
  console.log(`registering manifest to registry ${registry}`);

  if (isValidUrl(registry)) {
    await axios.post(registry, manifest);

    return;
  }

  if (!fs.existsSync(registry)) {
    fs.mkdirSync(registry, { recursive: true });
  }

  const metadata = Object.entries(manifest.remotes).reduce((acc, [key, remote]) => {
    acc[key] = remote.metadata;

    return acc;
  }, {} as Record<string, object>);
  const index = Object.entries(manifest.remotes).reduce((acc, [key, remote]) => {
    acc[key] = remote.manifestUrl;

    return acc;
  }, {} as Record<string, string>);

  updateDocument(`${registry}/appshell.index.json`, index, validators.appshell_index);
  updateDocument(`${registry}/appshell.metadata.json`, metadata, validators.appshell_metadata);
  updateDocument(`${registry}/appshell.manifest.json`, manifest, validators.appshell_manifest);
};
