/* eslint-disable no-console */
import { utils, validators } from '@appshell/config';
import { HttpStatusCode } from 'axios';
import fs from 'fs';
import path from 'path';
import axios from '../axios';

export type MergeManifestArgs = {
  manifest: (string | number)[] | undefined;
  outDir: string;
  outFile: string;
};

const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch {
    return false;
  }
};

const loadManifest = async (manifestPathOrUrl: string) => {
  if (isValidUrl(manifestPathOrUrl)) {
    const resp = await axios.get(manifestPathOrUrl);
    if (resp.status === HttpStatusCode.Ok) {
      return resp.data;
    }
    throw new Error(`Failed to load manifest from ${manifestPathOrUrl}`);
  }

  return JSON.parse(fs.readFileSync(manifestPathOrUrl, 'utf-8'));
};

export default async (argv: MergeManifestArgs) => {
  const { manifest, outDir, outFile } = argv;
  const manifests = (manifest as string[]) || [];
  if (manifests.length < 1) {
    console.log(`No manifests found. skipping manifest merge.`);
    return;
  }

  if (manifests.length === 1) {
    console.log(`Only one manifest found. skipping manifest merge.`);
    return;
  }

  console.log(`merging manifests --outDir=${outDir} --outFile=${outFile} --manifest=${manifests}`);

  try {
    const docs = await Promise.all(manifests.map(loadManifest));
    console.log(`Merging ${docs.length} manifests:`, JSON.stringify(manifests, null, 2));
    const merged = utils.merge(validators.merge_manifests, ...docs);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }
    fs.writeFileSync(path.join(outDir, outFile), JSON.stringify(merged));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error merging manifests', err.message);
  }
};
