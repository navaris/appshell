import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import deregister from '../src/deregister';

describe('deregister', () => {
  const packageName = 'config';
  const registryDir = path.resolve(`packages/${packageName}/__tests__/assets/sample_registry`);

  let writeFileSyncSpy: jest.SpyInstance;
  beforeEach(() => {
    writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should deregister entry from registry', async () => {
    const expectedGlobalConfig = {
      index: {
        'PongModule/Pong': 'http://localhost:30021/appshell.manifest.json',
        'PongModule/CoolComponent': 'http://localhost:30021/appshell.manifest.json',
        'ContainerModule/Container': 'http://localhost:30001/appshell.manifest.json',
      },
      metadata: {
        'PongModule/Pong': {
          route: '/pong',
          displayName: 'Pong Micro-Frontend',
          displayGroup: 'main',
          order: 20,
          icon: 'ViewList',
        },
        'PongModule/CoolComponent': {
          route: '/cool',
          displayName: 'Cool Shared Component',
          displayGroup: 'main',
          order: 30,
          icon: 'ViewList',
        },
        'ContainerModule/Container': {
          route: '/',
          displayName: 'Host App',
          displayGroup: 'main',
          order: 0,
          icon: 'ViewList',
        },
      },
    };
    const expectedManifest = {
      remotes: {
        'PongModule/Pong': {
          id: '6b3cbfed',
          manifestUrl: 'http://localhost:30021/appshell.manifest.json',
          remoteEntryUrl: 'http://localhost:30021/remoteEntry.js',
          scope: 'PongModule',
          module: './Pong',
          metadata: {
            route: '/pong',
            displayName: 'Pong Micro-Frontend',
            displayGroup: 'main',
            order: 20,
            icon: 'ViewList',
          },
        },
        'PongModule/CoolComponent': {
          id: '6554a942',
          manifestUrl: 'http://localhost:30021/appshell.manifest.json',
          remoteEntryUrl: 'http://localhost:30021/remoteEntry.js',
          scope: 'PongModule',
          module: './CoolComponent',
          metadata: {
            route: '/cool',
            displayName: 'Cool Shared Component',
            displayGroup: 'main',
            order: 30,
            icon: 'ViewList',
          },
        },
        'ContainerModule/Container': {
          id: '33a5786e',
          manifestUrl: 'http://localhost:30001/appshell.manifest.json',
          remoteEntryUrl: 'http://localhost:30001/remoteEntry.js',
          scope: 'ContainerModule',
          module: './Container',
          metadata: {
            route: '/',
            displayName: 'Host App',
            displayGroup: 'main',
            order: 0,
            icon: 'ViewList',
          },
        },
      },
      modules: {
        PongModule: {
          name: 'PongModule',
          exposes: {
            './Pong': './src/Pong',
            './CoolComponent': './src/CoolRemoteComponent',
          },
          filename: 'remoteEntry.js',
          shared: {
            react: {
              singleton: true,
              requiredVersion: '18.2.0',
            },
            'react-dom': {
              singleton: true,
              requiredVersion: '18.2.0',
            },
            'react-refresh': {
              singleton: true,
              requiredVersion: '^0.14.0',
            },
            'styled-components': {
              singleton: true,
              requiredVersion: '6.0.0-rc.3',
            },
            '@appshell/react': {
              singleton: true,
              requiredVersion: '^0.1.0-alpha.6',
            },
          },
        },
        ContainerModule: {
          name: 'ContainerModule',
          exposes: {
            './Container': './src/Container',
          },
          filename: 'remoteEntry.js',
          shared: {
            react: {
              singleton: true,
              requiredVersion: '18.2.0',
            },
            'react-dom': {
              singleton: true,
              requiredVersion: '18.2.0',
            },
            'react-refresh': {
              singleton: true,
              requiredVersion: '^0.14.0',
            },
            'styled-components': {
              singleton: true,
              requiredVersion: '6.0.0-rc.3',
            },
            '@appshell/react': {
              singleton: true,
              requiredVersion: '^0.1.0-alpha.6',
            },
          },
        },
      },
      environment: {
        ContainerModule: {
          BACKGROUND_COLOR: '#282c34',
        },
      },
    };

    await deregister('PingModule/Ping', registryDir);

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      `${registryDir}/appshell.config.json`,
      JSON.stringify(expectedGlobalConfig),
    );

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      `${registryDir}/appshell.manifest.json`,
      JSON.stringify(expectedManifest),
    );
  });

  it('should warn when deregistering entry that does not exist from registry', async () => {
    const componentKey = 'DoesNotExistModule/DoesNotExist';
    const consoleSpy = jest.spyOn(console, 'log');
    await deregister(componentKey, registryDir);

    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.yellow(`index entry not found for '${componentKey}'`),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.yellow(`metadata entry not found for '${componentKey}'`),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.yellow(`manifest entry not found for remotes[${componentKey}]`),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.yellow(`manifest entry not found for modules[${componentKey}]`),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.yellow(`manifest entry not found for environment[${componentKey}]`),
    );
  });

  it('should warn when deregistering from file that does not exist', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const registry = path.resolve(`packages/${packageName}/__tests__/assets/empty_dir`);

    await deregister('PingModule/Ping', registry);

    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.yellow(`registry file not found ${registry}/appshell.config.json`),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.yellow(`registry file not found ${registry}/appshell.manifest.json`),
    );
  });
});
