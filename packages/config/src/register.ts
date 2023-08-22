import fs from 'fs';
import axios from './axios';
import { AppshellManifest, AppshellRegister, ConfigValidator } from './types';
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

export default async (manifest: AppshellManifest, registryPathOrUrl: string) => {
  // eslint-disable-next-line no-console
  console.log(`registering manifest to registry ${registryPathOrUrl}`);

  if (isValidUrl(registryPathOrUrl)) {
    await axios.post(registryPathOrUrl, manifest);

    return;
  }

  if (!fs.existsSync(registryPathOrUrl)) {
    fs.mkdirSync(registryPathOrUrl, { recursive: true });
  }

  const registry = Object.entries(manifest.remotes).reduce(
    (acc, [key, remote]) => {
      acc.index[key] = remote.manifestUrl;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      acc.metadata![key] = remote.metadata;

      return acc;
    },
    { index: {}, metadata: {}, overrides: manifest.overrides } as AppshellRegister,
  );

  updateDocument(
    `${registryPathOrUrl}/appshell.register.json`,
    registry,
    validators.appshell_register,
  );
  updateDocument(
    `${registryPathOrUrl}/appshell.manifest.json`,
    manifest,
    validators.merge_manifests,
  );
};
