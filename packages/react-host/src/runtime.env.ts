declare global {
  interface Window {
    // eslint-disable-next-line import/prefer-default-export, @typescript-eslint/naming-convention
    appshell_env: Record<string, string | undefined>;
  }
}

const env = window.appshell_env;

if (!env.APPSHELL_CONFIGS_DIR && !env.APPSHELL_MANIFEST_URL) {
  throw new Error(
    `Missing runtime environment value. 'APPSHELL_MANIFEST_URL' is required if 'APPSHELL_CONFIGS_DIR' is not provided.`,
  );
}

if (!env.APPSHELL_ROOT) {
  throw new Error(
    `Missing runtime environment value. 'APPSHELL_ROOT' is required so the host knows which frontend to load.`,
  );
}

export default {
  APPSHELL_CONFIGS_DIR: env.APPSHELL_CONFIGS_DIR,
  APPSHELL_ROOT: env.APPSHELL_ROOT,
  APPSHELL_MANIFEST_URL: env.APPSHELL_MANIFEST_URL || 'appshell.manifest.json',
  APPSHELL_PRIMARY_COLOR: env.APPSHELL_PRIMARY_COLOR || '#8ed6fb',
  APPSHELL_THEME_COLOR: env.APPSHELL_THEME_COLOR || '#282c34',
};
