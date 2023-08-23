/* eslint-disable no-console */
import { AppshellGlobalConfig } from './types';
import { isValidUrl, merge } from './utils';
import loadJson from './utils/loadJson';
import { AppshellGlobalConfigValidator } from './validators';

type GenerateGlobalConfigOptions = {
  insecure: boolean;
};

export default async (
  registries: string[],
  options: GenerateGlobalConfigOptions = { insecure: false },
): Promise<AppshellGlobalConfig> => {
  const defaultGlobalConfig = { index: {}, metadata: {}, overrides: { environment: {} } };

  if (registries.length < 1) {
    console.log(`No registries found. skipping global configuration generation.`);
    return defaultGlobalConfig;
  }

  console.log(
    `generating global appshell configuration --registry=${JSON.stringify(registries, null, 2)}`,
  );

  try {
    const registers = await Promise.all(
      registries.map((reg) => {
        const registry = isValidUrl(reg) ? `${reg}/appshell.config.json` : reg;
        return loadJson<AppshellGlobalConfig>(registry, {
          insecure: options.insecure,
          target: /(.config.json)/i,
        });
      }),
    ).then((items) => items.flat());
    console.log(
      `Generating global configuration from ${registers.length} source${
        registers.length === 1 ? '' : 's'
      }`,
    );

    return merge(AppshellGlobalConfigValidator, ...registers) as AppshellGlobalConfig;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating global appshell configuration', err.message);
  }

  return defaultGlobalConfig;
};
