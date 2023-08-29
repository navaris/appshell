/* eslint-disable no-console */
import { AppshellManifest, register } from '@appshell/config';
import fs from 'fs';

export type RegisterManifestArgs = {
  manifest: string[] | undefined;
  registry: string;
  allowOverrides: boolean;
};

export default async (argv: RegisterManifestArgs) => {
  const { manifest: manifestPathOrUrls, registry, allowOverrides } = argv;

  try {
    console.log(
      `registering manifest --manifest=${manifestPathOrUrls} --registry=${registry} --allow-overrides=${allowOverrides}`,
    );

    const manifests = (manifestPathOrUrls as string[]) || [];
    const registrations = manifests.map(async (manifestPathOrUrl) => {
      if (!fs.existsSync(manifestPathOrUrl)) {
        throw new Error(`Manifest not found. ${manifestPathOrUrl}`);
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPathOrUrl, 'utf-8')) as AppshellManifest;

      return register(manifest, registry, allowOverrides);
    });

    await Promise.all(registrations);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error registering manifest', err.message);
  }
};
