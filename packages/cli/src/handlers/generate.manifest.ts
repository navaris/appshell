/* eslint-disable no-console */
import { generateManifest } from '@appshell/config';
import fs from 'fs';
import path from 'path';
import { cli } from 'webpack';

export type GenerateManifestArgs = {
  config: string;
  webpack: string;
  env: (string | number)[] | undefined;
  outDir: string;
  outFile: string;
};

type ArgValue = string | number | boolean | RegExp;

const options = cli.getArguments();

const processEnv = (env: string[] = []) =>
  env.reduce((acc, item) => {
    const [key, ...val] = item.split('=');
    console.log(item);
    acc[key] = val.length === 0 ? true : val.join('=');

    return acc;
  }, {} as Record<string, string | boolean>);

const processArgs = (args: Record<string, ArgValue | ArgValue[]>) =>
  Object.entries(args).reduce((acc, [key, val]) => {
    if (options[key]) {
      acc[key] = val;
    }
    return acc;
  }, {} as Record<string, ArgValue | ArgValue[]>);

export default async (argv: GenerateManifestArgs) => {
  const { config, webpack, env, outDir, outFile, ...rest } = argv;

  try {
    console.log(
      `generating manifest --config=${config} --webpack=${webpack} --outDir=${outDir} --outFile=${outFile}`,
    );

    const webpackEnv = processEnv(env as string[]);
    const webpackArgs = processArgs(rest);

    console.log(`webpack --env=${webpackEnv} --args=${webpackArgs}`);

    const problems = cli.processArguments(options, {}, webpackArgs);
    if (problems) {
      throw new Error(`Invalid webpack args: ${JSON.stringify(problems, null, 2)}`);
    }

    if (!fs.existsSync(config)) {
      console.log(`config not found '${config}'. skipping manifest generation.`);
    } else {
      const manifest = await generateManifest(config, webpack, webpackEnv, webpackArgs);

      if (manifest) {
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir);
        }
        fs.writeFileSync(path.join(outDir, outFile), JSON.stringify(manifest));
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating manifest', err.message);
  }
};
