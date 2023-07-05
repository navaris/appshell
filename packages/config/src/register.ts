import fs from 'fs';
import { snakeCase } from 'lodash';
import axios from './axios';
import { AppshellManifest } from './types';
import { isValidUrl } from './utils';

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

  const name = snakeCase(Object.keys(manifest.modules).join('_'));
  fs.writeFileSync(`${registry}/${name}.manifest.json`, JSON.stringify(manifest));
};
