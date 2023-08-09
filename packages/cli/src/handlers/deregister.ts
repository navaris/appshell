/* eslint-disable no-console */
import { deregister } from '@appshell/config';

export type DeregisterManifestArgs = {
  key: string[] | undefined;
  registry: string;
};

export default async (argv: DeregisterManifestArgs) => {
  const { key: keys, registry } = argv;

  try {
    console.log(`deregistering manifest --key=${keys} --registry=${registry}`);

    const manifestKeys = (keys as string[]) || [];

    await Promise.all(manifestKeys.map(async (manifestKey) => deregister(manifestKey, registry)));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error deregistering manifest', err.message);
  }
};
