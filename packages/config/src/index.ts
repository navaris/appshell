/**
 * @appshell/config package API
 */
export { default as configmap } from './configmap';
export { default as generateEnv } from './generate.env';
export { default as generateIndex } from './generate.index';
export { default as generateManifest } from './generate.manifest';
export { default as generateMetadata } from './generate.metadata';
export { default as register } from './register';
export type {
  AppshellConfig,
  AppshellConfigRemote,
  AppshellIndex,
  AppshellManifest,
  AppshellRemote,
  Metadata,
  Schema,
} from './types';
export * as utils from './utils';
export * as validators from './validators';
