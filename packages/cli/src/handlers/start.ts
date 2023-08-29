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
  allowOverrides: boolean;
  validateRegistrySslCert: boolean;
  metadata: boolean;
  manifestTemplate: string;
  manifest: string;
  registry: string;
  baseRegistry: string[];
};

export default async (argv: StartArgs): Promise<void> => {
  const {
    env,
    envGlobalName,
    envPrefix,
    outDir,
    remote,
    host,
    allowOverrides,
    validateRegistrySslCert,
    metadata,
    manifest,
    manifestTemplate,
    registry,
    baseRegistry,
  } = argv;

  // eslint-disable-next-line no-console
  console.log(
    `starting appshell --env=${env} --env-prefix=${envPrefix} --env-global-name=${envGlobalName} --out-dir=${outDir} --remote=${remote} --host=${host} --allow-overrides=${allowOverrides} --validate-registry-ssl-cert=${validateRegistrySslCert} --metadata=${metadata} --manifest=${manifest} --manifest-template=${manifestTemplate} --registry=${registry} --base-registry=${baseRegistry}`,
  );

  const prefix = 'appshell';
  const sources = baseRegistry.concat(registry).join(' ');

  if (remote) {
    const templatePath = path.join(outDir, manifestTemplate);
    const manifestPath = path.join(outDir, manifest);
    const templateDirname = path.dirname(templatePath);

    if (!fs.existsSync(templateDirname)) {
      fs.mkdirSync(templateDirname);
      fs.writeFileSync(templatePath, '');
    }

    const watchTemplate = exec(
      `npm exec -- nodemon --watch ${templatePath} --exec "appshell generate manifest --template ${templatePath} && appshell register --manifest ${manifestPath} --registry ${registry} --allow-overrides ${allowOverrides}"`,
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
      `npm exec -- nodemon --watch ${registry} --delay 500ms --ext json --exec "appshell generate global-config --registry ${sources} --validate-registry-ssl-cert ${!!validateRegistrySslCert}"`,
    );
    watchRegistry.stdout?.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`${prefix}: ${data}`);
    });
  }
};
