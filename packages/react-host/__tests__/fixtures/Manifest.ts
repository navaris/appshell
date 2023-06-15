import { AppshellManifest } from '@appshell/config';

export default {
  remotes: {
    'TestModule/TestComponent': {
      id: 'test-component',
      scope: 'TestModule',
      module: './TestComponent',
      url: 'http://test.com/remoteEntry.js',
      metadata: {},
    },
  },
  modules: {},
} as AppshellManifest;
