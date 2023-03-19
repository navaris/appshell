import { ModuleContainer, ShareScope } from './types';

/* eslint-disable @typescript-eslint/naming-convention */
declare global {
  function __webpack_init_sharing__(id: string): Promise<void>;
  // eslint-disable-next-line no-underscore-dangle
  const __webpack_share_scopes__: { default: ShareScope };
  interface Window {
    [key: string]: unknown;
    __webpack_share_scopes__: Record<string, ShareScope>;
  }
}

type ShareScopes = keyof typeof __webpack_share_scopes__;

export default async <TComponent>(scope: string, module: string, shareScope = 'default') => {
  // eslint-disable-next-line no-console
  console.debug(
    `loading federated component: { scope: ${scope}, module: ${module}, shareScope: ${shareScope} }`,
  );

  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__(shareScope);
  const container = window[scope] as ModuleContainer<TComponent>;

  if (!container) {
    throw new Error(`Failed to find module container ${scope}`);
  }

  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__[shareScope as ShareScopes]);
  const factory = await container.get(module);

  if (!factory) {
    throw new Error(`Invalid factory produced by container for module ${module}.`);
  }

  const Module = factory();

  // eslint-disable-next-line no-console
  console.debug(
    `federated component loaded: { scope: ${scope}, module: ${module}, shareScope: ${shareScope} }`,
  );

  const Component = Module[shareScope as ShareScopes];

  return Component;
};
