/* eslint-disable no-console */
import { deregister } from '@appshell/config';

export type DeregisterManifestArgs = {
  key: string[] | undefined;
  registry: string;
};

export default async (argv: DeregisterManifestArgs) => {
  const { key: keys, registry } = argv;

  try {
    console.log(`deregistering app --key=${keys} --registry=${registry}`);

    const moduleNames = (keys as string[]) || [];

    await Promise.all(moduleNames.map(async (moduleName) => deregister(moduleName, registry)));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error deregistering manifest', err.message);
  }
};
