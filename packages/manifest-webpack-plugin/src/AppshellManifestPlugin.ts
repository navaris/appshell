/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { AppshellConfig, Schema, utils, validators } from '@appshell/config';
import { ModuleFederationPluginOptions } from '@appshell/config/src/types';
import fs from 'fs';
import hash_sum from 'hash-sum';
import { entries, keys } from 'lodash';
import path from 'path';
import { validate } from 'schema-utils';
import { Compiler, container, WebpackOptionsNormalized, WebpackPluginInstance } from 'webpack';

type AppManifestPluginOptions = { config?: string };

type ModuleFederationPluginInstance = WebpackPluginInstance & {
  _options?: ModuleFederationPluginOptions;
};

const PLUGIN_NAME = 'AppManifestPlugin';

const schema: Schema = {
  title: 'AppManifestPlugin',
  type: 'object',
  properties: {
    config: {
      description: 'The path to the appshell.config.yaml to process',
      type: 'string',
    },
  },
};

/**
 * AppshellManifestPlugin produces app manifests that will subsequently be
 * compiled into the global Appshell configuration.
 */
export default class AppshellManifestPlugin {
  defaults = {
    config: 'appshell.config.yaml',
  };

  options: AppManifestPluginOptions = {
    config: this.defaults.config,
  };

  constructor(options?: AppManifestPluginOptions) {
    if (options) {
      validate(schema, options, { name: PLUGIN_NAME });
    }

    this.options = {
      ...this.defaults,
      ...options,
    };
  }

  static findModuleFederationPlugin(webpackConfig: WebpackOptionsNormalized) {
    const mfPlugin: ModuleFederationPluginInstance | undefined = webpackConfig.plugins?.find(
      (plugin) => plugin.constructor.name === container.ModuleFederationPlugin.name,
    );

    return mfPlugin;
  }

  static prepare(config: AppshellConfig, plugin: ModuleFederationPluginInstance) {
    entries(config.remotes).forEach(([key, remote]) => {
      remote.id = hash_sum(key);
    });
    config.module = plugin._options || {};
    config.name = config.name || config.module.name;
    config.environment = config.environment
      ? {
          [config.name || 'unknown']: config.environment,
        }
      : {};
  }

  static validate(config: AppshellConfig) {
    if (!config.module.name) {
      throw new Error('Module name is required.');
    }

    validators.appshell_config.validate(config);

    const pluginRemotes = keys(config.module.exposes).map((key) =>
      path.join(`${config.module.name}/${path.basename(key)}`),
    );
    const configuredRemotes = keys(config.remotes);

    if (!pluginRemotes.every((remote) => configuredRemotes.includes(remote))) {
      throw new Error(
        `Validation error: Missing entrypoint in appshell.config.yaml. Expected: ${pluginRemotes}, Found: ${configuredRemotes}`,
      );
    }

    if (
      !configuredRemotes
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .filter((key) => key.startsWith(config.module.name!))
        .every((remote) => pluginRemotes.includes(remote))
    ) {
      throw new Error(
        `Validation error: Missing exposed entrypoint in ModuleFederationPlugin. Expected: ${configuredRemotes}, Found: ${pluginRemotes}`,
      );
    }

    return true;
  }

  /**
   * Apply the plugin
   * @param {Compiler} compiler the compiler instance
   * @returns {void}
   */
  apply(compiler: Compiler) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const configPath = path.resolve(this.options.config!);
    const config = utils.load<AppshellConfig>(configPath);
    const plugin = AppshellManifestPlugin.findModuleFederationPlugin(compiler.options);

    if (!plugin) {
      // could hook in mmf plugin here and work off of config too
      throw new Error('Webpack ModuleFederationPlugin is required to use this plugin.');
    }

    AppshellManifestPlugin.prepare(config, plugin);
    AppshellManifestPlugin.validate(config);

    compiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation) => {
      const configName = path.basename(this.defaults.config, path.extname(this.defaults.config));
      const outputFile = path.resolve(compilation.outputOptions.path || '', `${configName}.json`);

      fs.writeFileSync(outputFile, JSON.stringify(config));
    });
  }
}
