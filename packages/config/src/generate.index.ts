/* eslint-disable no-console */
import { AppshellIndex } from './types';
import { merge } from './utils';
import loadJson from './utils/loadJson';
import { appshell_index } from './validators';

export default async (registries: string[]): Promise<AppshellIndex> => {
  if (registries.length < 1) {
    console.log(`No registries found. skipping index generation.`);
    return {};
  }

  console.log(`generating appshell index --registry=${JSON.stringify(registries, null, 2)}`);

  try {
    const indexes = await Promise.all(
      registries.map((reg) => loadJson<AppshellIndex>(reg, /(.index.json)/i)),
    ).then((items) => items.flat());
    console.log(`Generating index from ${indexes.length} source${indexes.length === 1 ? '' : 's'}`);

    return merge(appshell_index, ...indexes) as AppshellIndex;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating appshell index', err.message);
  }

  return {};
};
