/* eslint-disable no-console */
import { AppshellRegister } from './types';
import { isValidUrl, merge } from './utils';
import loadJson from './utils/loadJson';
import { appshell_register } from './validators';

type GenerateRegisterOptions = {
  insecure: boolean;
};

export default async (
  registries: string[],
  options: GenerateRegisterOptions = { insecure: false },
): Promise<AppshellRegister> => {
  const defaultRegister = { index: {}, metadata: {}, overrides: { environment: {} } };

  if (registries.length < 1) {
    console.log(`No registries found. skipping register generation.`);
    return defaultRegister;
  }

  console.log(`generating appshell register --registry=${JSON.stringify(registries, null, 2)}`);

  try {
    const registers = await Promise.all(
      registries.map((reg) => {
        const registry = isValidUrl(reg) ? `${reg}/appshell.register.json` : reg;
        return loadJson<AppshellRegister>(registry, {
          insecure: options.insecure,
          target: /(.register.json)/i,
        });
      }),
    ).then((items) => items.flat());
    console.log(
      `Generating register from ${registers.length} source${registers.length === 1 ? '' : 's'}`,
    );

    return merge(appshell_register, ...registers) as AppshellRegister;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating appshell index', err.message);
  }

  return defaultRegister;
};
