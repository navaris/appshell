/* eslint-disable no-console */
import { Metadata } from './types';
import { merge } from './utils';
import loadJson from './utils/loadJson';
import { appshell_metadata } from './validators';

export default async <T = Record<string, Metadata>>(registries: string[]): Promise<T> => {
  if (registries.length < 1) {
    console.log(`No registries found. skipping metadata generation.`);
    return {} as T;
  }

  try {
    const metadata = await Promise.all(
      registries.map((reg) => loadJson<T>(reg, /(.metadata.json)/i)),
    ).then((items) => items.flat());
    console.log(
      `Generating metadata from ${metadata.length} source${metadata.length === 1 ? '' : 's'}`,
    );

    return merge(appshell_metadata, ...metadata) as T;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating appshell metadata', err.message);
  }

  return {} as T;
};
