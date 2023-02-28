import {
  AppshellConfig,
  load,
  ModuleFederationPluginOptions,
  Schema,
  validators,
} from '@appshell/config';
import fs from 'fs';
import hash_sum from 'hash-sum';
import { entries, keys, values } from 'lodash';
import path from 'path';
import { validate } from 'schema-utils';
import { Compiler, container, WebpackOptionsNormalized, WebpackPluginInstance } from 'webpack';

type AppManifestPluginOptions = { config?: string; configsDir?: string };

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
    configsDir: {
      description: 'The output directory for all of the configurations',
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
    configsDir: 'appshell_configs',
  };

  options: AppManifestPluginOptions = {
    config: this.defaults.config,
    configsDir: this.defaults.configsDir,
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

  findModuleFederationPlugin(webpackConfig: WebpackOptionsNormalized) {
    const mfPlugin: ModuleFederationPluginInstance | undefined = webpackConfig.plugins?.find(
      (plugin) => plugin.constructor.name === container.ModuleFederationPlugin.name,
    );

    return mfPlugin;
  }

  prepare(config: AppshellConfig, plugin: ModuleFederationPluginInstance) {
    entries(config.remotes).forEach(([key, remote]) => {
      remote.id = hash_sum(key);
    });
    config.module = plugin._options || {};
  }

  validate(config: AppshellConfig) {
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

    const configuredUrls = values(config.remotes).map((entrypoint) => entrypoint.url);
    if (!configuredUrls.every((url) => path.basename(url) === config.module.filename)) {
      throw new Error(
        `Validation error: Mismatched remote url filename in appshell.config.yaml. Expected: ${config.module.filename}, Found: ${configuredUrls}`,
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
    const config = load<AppshellConfig>(configPath);
    const plugin = this.findModuleFederationPlugin(compiler.options);

    if (!plugin) {
      // could hook in mmf plugin here and work off of config too
      throw new Error('Webpack ModuleFederationPlugin is required to use this plugin.');
    }

    if (!plugin._options?.name) {
      throw new Error('Module name is required.');
    }

    compiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation) => {
      const configsDir =
        this.options.configsDir && this.options.configsDir !== this.defaults.configsDir
          ? path.resolve(this.options.configsDir)
          : path.resolve(compilation.outputOptions.path || '', this.defaults.configsDir);

      this.prepare(config, plugin);
      this.validate(config);

      if (!fs.existsSync(configsDir)) {
        fs.mkdirSync(configsDir);
      }

      fs.writeFileSync(
        path.join(configsDir, `${config.module.name}-${hash_sum(configPath)}.json`),
        JSON.stringify(config),
      );
    });
  }
}
