/* eslint-disable no-console */
import { AppshellManifest, Metadata } from './types';
import loadJson from './utils/loadJson';

export default async <T = Record<string, Metadata>>(registries: string[]): Promise<T> => {
  if (registries.length < 1) {
    console.log(`No registries found. skipping metadata generation.`);
    return {} as T;
  }

  try {
    const manifests = await Promise.all(registries.map(loadJson<AppshellManifest>)).then((items) =>
      items.flat(),
    );

    console.log(
      `Generating metadata from ${manifests.length} manifest${manifests.length === 1 ? '' : 's'}`,
    );

    return manifests.reduce((entries, manifest) => {
      const res = Object.entries(manifest.remotes).reduce((acc, [key, val]) => {
        // todo: fix type
        (acc as any)[key] = val.metadata;

        return acc;
      }, entries);

      return res;
    }, {} as T);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating appshell metadata', err.message);
  }

  return {} as T;
};
