import { AppshellManifest } from '@appshell/config';

export default {
  remotes: {
    'TestModule/TestComponent': {
      id: 'test-component',
      scope: 'TestModule',
      module: './TestComponent',
      manifestUrl: 'http://test.com/appshell.manifest.json',
      remoteEntryUrl: 'http://test.com/remoteEntry.js',
      metadata: {},
    },
  },
  modules: {},
  environment: {},
} as AppshellManifest;
