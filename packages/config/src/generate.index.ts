/* eslint-disable no-console */
import { AppshellIndex, AppshellManifest } from './types';
import loadJson from './utils/loadJson';

export default async (registries: string[]): Promise<AppshellIndex> => {
  if (registries.length < 1) {
    console.log(`No registries found. skipping index generation.`);
    return {};
  }

  console.log(`generating appshell index --registry=${registries}`);

  try {
    const manifests = await Promise.all(registries.map(loadJson<AppshellManifest>)).then((items) =>
      items.flat(),
    );
    console.log(
      `Generating index from ${manifests.length} manifest${manifests.length === 1 ? '' : 's'}`,
    );

    return manifests.reduce((entries, manifest) => {
      const res = Object.entries(manifest.remotes).reduce((acc, [key, val]) => {
        acc[key] = val.manifestUrl;

        return acc;
      }, entries);

      return res;
    }, {} as Record<string, string>);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating appshell index', err.message);
  }

  return {};
};
