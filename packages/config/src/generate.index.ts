/* eslint-disable no-console */
import { AppshellIndex } from './types';
import { isValidUrl, merge } from './utils';
import loadJson from './utils/loadJson';
import { appshell_index } from './validators';

type GenerateIndexOptions = {
  insecure: boolean;
};

export default async (
  registries: string[],
  options: GenerateIndexOptions = { insecure: false },
): Promise<AppshellIndex> => {
  if (registries.length < 1) {
    console.log(`No registries found. skipping index generation.`);
    return {};
  }

  console.log(`generating appshell index --registry=${JSON.stringify(registries, null, 2)}`);

  try {
    const indexes = await Promise.all(
      registries.map((reg) => {
        const registry = isValidUrl(reg) ? `${reg}/appshell.index.json` : reg;
        return loadJson<AppshellIndex>(registry, {
          insecure: options.insecure,
          target: /(.index.json)/i,
        });
      }),
    ).then((items) => items.flat());
    console.log(`Generating index from ${indexes.length} source${indexes.length === 1 ? '' : 's'}`);

    return merge(appshell_index, ...indexes) as AppshellIndex;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating appshell index', err.message);
  }

  return {};
};
