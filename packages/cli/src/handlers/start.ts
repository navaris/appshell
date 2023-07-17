import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export type StartArgs = {
  outDir: string;
  env: string;
  envPrefix: string;
  envGlobalName: string;

  remote: boolean;
  host: boolean;
  insecure: boolean;
  metadata: boolean;
  manifestTemplate: string;
  manifest: string;
  registry: string;
  adjunctRegistry: string[];
};

export default async (argv: StartArgs): Promise<void> => {
  const {
    env,
    envGlobalName,
    envPrefix,
    outDir,
    remote,
    host,
    insecure,
    metadata,
    manifest,
    manifestTemplate,
    registry,
    adjunctRegistry,
  } = argv;

  // eslint-disable-next-line no-console
  console.log(
    `starting appshell --env=${env} --env-prefix=${envPrefix} --env-global-name=${envGlobalName} --out-dir=${outDir} --remote=${remote} --host=${host} --insecure=${insecure} --metadata=${metadata} --manifest=${manifest} --manifest-template=${manifestTemplate} --registry=${registry} --adjunct-registry=${adjunctRegistry}`,
  );

  const prefix = 'appshell';
  const sources = adjunctRegistry.concat(registry).join(' ');

  if (remote) {
    const templatePath = path.join(outDir, manifestTemplate);
    const manifestPath = path.join(outDir, manifest);
    const templateDirname = path.dirname(templatePath);

    if (!fs.existsSync(templateDirname)) {
      fs.mkdirSync(templateDirname);
      fs.writeFileSync(templatePath, '');
    }

    const watchTemplate = exec(
      `npm exec -- nodemon --watch ${templatePath} --exec "appshell generate manifest --template ${templatePath} && appshell register --manifest ${manifestPath} --registry ${registry}"`,
    );
    watchTemplate.stdout?.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`${prefix}: ${data}`);
    });
  }

  if (host) {
    const watchEnv = exec(
      `npm exec -- nodemon --watch ${env} --exec "appshell generate env -e ${env} --overwrite --prefix ${envPrefix} --globalName ${envGlobalName}"`,
    );
    watchEnv.stdout?.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`${prefix}: ${data}`);
    });

    if (!fs.existsSync(registry)) {
      fs.mkdirSync(registry);
    }
    const watchRegistry = exec(
      `npm exec -- nodemon --watch ${registry} --delay 500ms --ext json --exec "appshell generate index --registry ${sources} --insecure=${insecure} && appshell generate metadata --registry ${sources} --insecure=${insecure}"`,
    );
    watchRegistry.stdout?.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`${prefix}: ${data}`);
    });
  }
};
