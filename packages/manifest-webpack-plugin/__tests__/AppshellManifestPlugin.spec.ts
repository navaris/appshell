/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import { values } from 'lodash';
import { rimrafSync } from 'rimraf';
import { Compilation, container, WebpackOptionsNormalized } from 'webpack';
import AppshellManifestPlugin from '../src/AppshellManifestPlugin';
import sampleConfig from './assets/complete-config.json';
import missingConfiguredEntrypoint from './assets/missing-configured-entrypoint.json';
import missingRemoteEntrypoint from './assets/missing-remote-entrypoint.json';
import { MODULE_FEDERATION_PLUGIN_OPTIONS } from './assets/module-federation-plugin-options';
import webpackConfig from './assets/webpack.config.js';

class MockCompiler {
  options: Partial<WebpackOptionsNormalized>;

  compilation: Partial<Compilation>;

  handlers: Record<string, () => void> = {};

  hooks = {
    afterEmit: {
      tap: (name: string, callback: () => void) => {
        this.handlers[name] = callback;
      },
    },
  };

  constructor(options: Partial<WebpackOptionsNormalized>, compilation: Partial<Compilation>) {
    this.options = options;
    this.compilation = compilation;
  }

  invokeHandlers() {
    values(this.handlers).forEach((handler) => handler.call(this.compilation));
  }
}

describe('AppshellManifestPlugin', () => {
  const packageName = 'manifest-webpack-plugin';
  const config = `packages/${packageName}/__tests__/assets/appshell.config.yaml`;
  const configsDir = `packages/${packageName}/__tests__/assets/app_manifests`;

  let compiler: MockCompiler;
  beforeEach(() => {
    const plugins = [new container.ModuleFederationPlugin(MODULE_FEDERATION_PLUGIN_OPTIONS)];
    compiler = new MockCompiler({ plugins }, {});
  });

  afterEach(() => {
    rimrafSync(configsDir);
  });

  describe('validate', () => {
    it('should throw if config is missing remote entrypoints defined in the MF plugin', () => {
      expect(() => AppshellManifestPlugin.validate(missingRemoteEntrypoint as any)).toThrowError(
        /Validation error: Missing entrypoint/i,
      );
    });

    it('should throw if config has remote entrypoints not defined in the MF plugin', () => {
      expect(() =>
        AppshellManifestPlugin.validate(missingConfiguredEntrypoint as any),
      ).toThrowError(/Validation error: Missing exposed entrypoint in ModuleFederationPlugin/i);
    });
  });

  describe('findModuleFederationPlugin', () => {
    it('should find ModuleFederationPlugin if it exists', () => {
      const moduleFederationPlugin = AppshellManifestPlugin.findModuleFederationPlugin(
        webpackConfig as any,
      );

      expect(moduleFederationPlugin).toBeTruthy();
    });

    it('should return undefined if ModuleFederationPlugin does not exist', () => {
      webpackConfig.plugins = [];
      expect(
        AppshellManifestPlugin.findModuleFederationPlugin(webpackConfig as any),
      ).toBeUndefined();
    });
  });

  describe('defaults', () => {
    it('should default config to appshell.config.yaml', () => {
      const plugin = new AppshellManifestPlugin();

      expect(plugin.options.config).toEqual('appshell.config.yaml');
    });

    it('should default configsDir to <project>/appshell_configs', () => {
      const plugin = new AppshellManifestPlugin({ config });

      expect(plugin.options.configsDir).toEqual('appshell_configs');
    });
  });

  describe('apply', () => {
    it('should throw if ModuleFederationPlugin is not found', () => {
      const plugin = new AppshellManifestPlugin({ config, configsDir });

      compiler.options.plugins = [];

      expect(() => plugin.apply(compiler as any)).toThrowError(
        /Webpack ModuleFederationPlugin is required/i,
      );
    });

    it('should write configuration to configsDir', () => {
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
      const plugin = new AppshellManifestPlugin({ config, configsDir });

      plugin.apply(compiler as any);
      compiler.invokeHandlers();

      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        expect.anything(),
        JSON.stringify(sampleConfig),
      );
    });
  });
});
