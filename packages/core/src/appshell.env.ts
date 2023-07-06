/* eslint-disable no-underscore-dangle */
declare global {
  interface Window {
    // eslint-disable-next-line import/prefer-default-export, @typescript-eslint/naming-convention
    __appshell_env__: Record<string, string | undefined>;
  }
}

const env = window.__appshell_env__;

if (!env.APPSHELL_ROOT) {
  throw new Error(
    `Missing runtime environment value. 'APPSHELL_ROOT' is required so the host knows which frontend to load.`,
  );
}

export default {
  APPSHELL_PUBLIC_URL: env.APPSHELL_PUBLIC_URL || '',
  APPSHELL_ROOT: env.APPSHELL_ROOT,
  APPSHELL_ROOT_PROPS: env.APPSHELL_ROOT_PROPS || '{}',
  APPSHELL_INDEX_URL: env.APPSHELL_INDEX_URL || '/appshell.index.json',
  APPSHELL_PRIMARY_COLOR: env.APPSHELL_PRIMARY_COLOR || '#8ed6fb',
  APPSHELL_THEME_COLOR: env.APPSHELL_THEME_COLOR || '#282c34',
};
