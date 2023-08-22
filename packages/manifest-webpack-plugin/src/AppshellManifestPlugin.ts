/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { AppshellConfig, Schema, utils, validators } from '@appshell/config';
import { AppshellTemplate, ModuleFederationPluginOptions } from '@appshell/config/src/types';
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

  static createTemplate(
    config: AppshellConfig,
    plugin: ModuleFederationPluginInstance,
  ): AppshellTemplate {
    const name = config.name || plugin._options?.name;
    const template: AppshellTemplate = {
      name,
      ...config,
      module: plugin._options || {},
      environment: config.environment
        ? {
            [name || 'unknown']: config.environment,
          }
        : {},
    };

    entries(template.remotes).forEach(([key, remote]) => {
      remote.id = hash_sum(key);
    });

    return template;
  }

  static validate(template: AppshellTemplate) {
    if (!template.module.name) {
      throw new Error('Module name is required.');
    }

    validators.AppshellTemplateValidator.validate(template);

    const pluginRemotes = keys(template.module.exposes).map((key) =>
      path.join(`${template.module.name}/${path.basename(key)}`),
    );
    const configuredRemotes = keys(template.remotes);

    if (!pluginRemotes.every((remote) => configuredRemotes.includes(remote))) {
      throw new Error(
        `Validation error: Missing entrypoint in appshell.config.yaml. Expected: ${pluginRemotes}, Found: ${configuredRemotes}`,
      );
    }

    if (
      !configuredRemotes
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .filter((key) => key.startsWith(template.module.name!))
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

    const template = AppshellManifestPlugin.createTemplate(config, plugin);
    AppshellManifestPlugin.validate(template);

    compiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation) => {
      const outputFile = path.resolve(
        compilation.outputOptions.path || '',
        'appshell.template.json',
      );

      fs.writeFileSync(outputFile, JSON.stringify(template));
    });
  }
}
