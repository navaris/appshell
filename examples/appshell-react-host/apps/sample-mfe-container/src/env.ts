/**
 * This file is used to provide runtime environment values to the application.
 * The variable __appshell_env__ContainerModule is injected into the window object
 * when the remote module is consumed via FederatedComponent.
 */

// eslint-disable-next-line no-underscore-dangle
const env = window.__appshell_env__ContainerModule || {};

if (!env.BACKGROUND_COLOR) {
  throw new Error(`Missing runtime environment value. 'BACKGROUND_COLOR' is required.`);
}

export default {
  BACKGROUND_COLOR: env.BACKGROUND_COLOR,
};
