import { ModuleFederationPluginOptions } from '@appshell/config';

// eslint-disable-next-line import/prefer-default-export
export const MODULE_FEDERATION_PLUGIN_OPTIONS: ModuleFederationPluginOptions = {
  exposes: {
    './Foo': './src/Entry1',
    './Bar': './src/Entry2',
  },
  filename: 'remoteEntry.js',
  library: {
    name: 'some shared lib',
    // Type of library (types included by default are 'var', 'module', 'assign', 'assign-properties', 'this', 'window', 'self', 'global', 'commonjs', 'commonjs2', 'commonjs-module', 'commonjs-static', 'amd', 'amd-require', 'umd', 'umd2', 'jsonp', 'system', but others might be added by plugins).
    type: 'umd',
  },
  name: 'TestModule',
  remotes: {
    './Remote1': {
      // Container locations from which modules should be resolved and loaded at runtime.
      external: 'external module',
      // The name of the share scope shared with this remote.
      shareScope: '@shared',
    },
  },
  // The external type of the remote containers.
  remoteType: 'amd',
  // The name of the runtime chunk. If set a runtime chunk with this name is created or an existing entrypoint is used as runtime.
  runtime: 'runtimeChunk',
  shared: {
    package1: {
      singleton: true,
      requiredVersion: '0.1.0',
    },
    package2: {
      singleton: true,
      requiredVersion: '1.1.0',
    },
  },
  shareScope: '@sharedscope',
};
