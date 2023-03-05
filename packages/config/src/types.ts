import { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';

export type Schema = JSONSchema4 | JSONSchema6 | JSONSchema7;

export type ConfigValidator = {
  validate: <T>(...config: T[]) => void;
};

export type ConfigMap = Record<string, string>;

/* appshell.config.yaml types */
export type AppshellConfigRemote<TMetadata = Record<string, unknown>> = {
  id: string;
  url: string;
  metadata: TMetadata;
};

export type AppshellConfig<TMetadata = Record<string, unknown>> = {
  name?: string;
  remotes?: Record<string, AppshellConfigRemote<TMetadata>>;
  module: ModuleFederationPluginOptions;
};

/** Appshell manifest types */
export type AppshellRemote<TMetadata = Record<string, unknown>> = {
  id: string;
  url: string;
  scope: string;
  module: string;
  shareScope?: string;
  metadata: TMetadata;
};

export type AppshellManifest<TMetadata = Record<string, unknown>> = {
  remotes: Record<string, AppshellRemote<TMetadata>>;
  modules: Record<string, ModuleFederationPluginOptions>;
};

/**
 * Advanced configuration for modules that should be exposed by this container.
 */
export interface ExposesConfig {
  /**
   * Request to a module that should be exposed by this container.
   */
  import: string | string[];

  /**
   * Custom chunk name for the exposed module.
   */
  name?: string;
}

export interface ExposesObject {
  [index: string]: string | ExposesConfig | string[];
}

/**
 * Set explicit comments for `commonjs`, `commonjs2`, `amd`, and `root`.
 */
export interface LibraryCustomUmdCommentObject {
  /**
   * Set comment for `amd` section in UMD.
   */
  amd?: string;

  /**
   * Set comment for `commonjs` (exports) section in UMD.
   */
  commonjs?: string;

  /**
   * Set comment for `commonjs2` (module.exports) section in UMD.
   */
  commonjs2?: string;

  /**
   * Set comment for `root` (global variable) section in UMD.
   */
  root?: string;
}

/**
 * Description object for all UMD variants of the library name.
 */
export interface LibraryCustomUmdObject {
  /**
   * Name of the exposed AMD library in the UMD.
   */
  amd?: string;

  /**
   * Name of the exposed commonjs export in the UMD.
   */
  commonjs?: string;

  /**
   * Name of the property exposed globally by a UMD library.
   */
  root?: string | string[];
}

/**
 * Options for library.
 */
export interface LibraryOptions {
  /**
   * Add a comment in the UMD wrapper.
   */
  auxiliaryComment?: string | LibraryCustomUmdCommentObject;

  /**
   * Specify which export should be exposed as library.
   */
  export?: string | string[];

  /**
   * The name of the library (some types allow unnamed libraries too).
   */
  name?: string | string[] | LibraryCustomUmdObject;

  /**
   * Type of library (types included by default are 'var', 'module', 'assign', 'assign-properties', 'this', 'window', 'self', 'global', 'commonjs', 'commonjs2', 'commonjs-module', 'commonjs-static', 'amd', 'amd-require', 'umd', 'umd2', 'jsonp', 'system', but others might be added by plugins).
   */
  type: string;

  /**
   * If `output.libraryTarget` is set to umd and `output.library` is set, setting this to true will name the AMD module.
   */
  umdNamedDefine?: boolean;
}

export interface SharedConfig {
  /**
   * Include the provided and fallback module directly instead behind an async request. This allows to use this shared module in initial load too. All possible shared modules need to be eager too.
   */
  eager?: boolean;

  /**
   * Provided module that should be provided to share scope. Also acts as fallback module if no shared module is found in share scope or version isn't valid. Defaults to the property name.
   */
  import?: string | false;

  /**
   * Package name to determine required version from description file. This is only needed when package name can't be automatically determined from request.
   */
  packageName?: string;

  /**
   * Version requirement from module in share scope.
   */
  requiredVersion?: string | false;

  /**
   * Module is looked up under this key from the share scope.
   */
  shareKey?: string;

  /**
   * Share scope name.
   */
  shareScope?: string;

  /**
   * Allow only a single version of the shared module in share scope (disabled by default).
   */
  singleton?: boolean;

  /**
   * Do not accept shared module if version is not valid (defaults to yes, if local fallback module is available and shared module is not a singleton, otherwise no, has no effect if there is no required version specified).
   */
  strictVersion?: boolean;

  /**
   * Version of the provided module. Will replace lower matching versions, but not higher.
   */
  version?: string | false;
}

export interface SharedObject {
  [index: string]: string | SharedConfig;
}

/**
 * Advanced configuration for container locations from which modules should be resolved and loaded at runtime.
 */
export interface RemotesConfig {
  /**
   * Container locations from which modules should be resolved and loaded at runtime.
   */
  external: string | string[];

  /**
   * The name of the share scope shared with this remote.
   */
  shareScope?: string;
}

/**
 * Container locations from which modules should be resolved and loaded at runtime. Property names are used as request scopes.
 */
export interface RemotesObject {
  [index: string]: string | RemotesConfig | string[];
}

export interface ModuleFederationPluginOptions {
  /**
   * Modules that should be exposed by this container. When provided, property name is used as public name, otherwise public name is automatically inferred from request.
   */
  exposes?: (string | ExposesObject)[] | ExposesObject;

  /**
   * The filename of the container as relative path inside the `output.path` directory.
   */
  filename?: string;

  /**
   * Options for library.
   */
  library?: LibraryOptions;

  /**
   * The name of the container.
   */
  name?: string;

  /**
   * The external type of the remote containers.
   */
  remoteType?:
    | 'import'
    | 'var'
    | 'module'
    | 'assign'
    | 'this'
    | 'window'
    | 'self'
    | 'global'
    | 'commonjs'
    | 'commonjs2'
    | 'commonjs-module'
    | 'commonjs-static'
    | 'amd'
    | 'amd-require'
    | 'umd'
    | 'umd2'
    | 'jsonp'
    | 'system'
    | 'promise'
    | 'script'
    | 'node-commonjs'
    | string;

  /**
   * Container locations and request scopes from which modules should be resolved and loaded at runtime. When provided, property name is used as request scope, otherwise request scope is automatically inferred from container location.
   */
  remotes?: (string | RemotesObject)[] | RemotesObject;

  /**
   * The name of the runtime chunk. If set a runtime chunk with this name is created or an existing entrypoint is used as runtime.
   */
  runtime?: string | false;

  /**
   * Share scope name used for all shared modules (defaults to 'default').
   */
  shareScope?: string;

  /**
   * Modules that should be shared in the share scope. When provided, property names are used to match requested modules in this compilation.
   */
  shared?: (string | SharedObject)[] | SharedObject;
}
