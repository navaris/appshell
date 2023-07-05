/* eslint-disable no-param-reassign */
import fs from 'fs';
import hash_sum from 'hash-sum';
import { entries, keys } from 'lodash';
import { requireFromString } from 'module-from-string';
import path from 'path';
import { container, WebpackOptionsNormalized, WebpackPluginInstance } from 'webpack';
import configmap from './configmap';
import { toAppshellManifest } from './mappers/appshell.config';
import { AppshellConfig, ModuleFederationPluginOptions } from './types';
import * as utils from './utils';
import * as validators from './validators';

type ModuleFederationPluginInstance = WebpackPluginInstance & {
  _options?: ModuleFederationPluginOptions;
};

const loadWebpackConfig = async (
  configPath: string,
  env: Record<string, string | number>,
  args: Record<string, string | number>,
) => {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Webpack config not found '${configPath}'.`);
  }

  try {
    const code = fs.readFileSync(path.resolve(configPath), 'utf-8');
    const webpackModule = requireFromString(code, {
      filename: path.basename(configPath),
      dirname: process.cwd(),
      useCurrentGlobal: true,
    });
    const webpackConfig: WebpackOptionsNormalized =
      typeof webpackModule === 'function' ? webpackModule({ ...env }, { ...args }) : webpackModule;

    return webpackConfig;
  } catch (err) {
    throw new Error(`Failed to load webpack config from ${configPath}`);
  }
};

const findModuleFederationPlugin = (webpackConfig: WebpackOptionsNormalized) => {
  const mfPlugin: ModuleFederationPluginInstance | undefined = webpackConfig.plugins?.find(
    (plugin) => plugin.constructor.name === container.ModuleFederationPlugin.name,
  );

  return mfPlugin;
};

const prepare = (config: AppshellConfig, plugin: ModuleFederationPluginInstance) => {
  entries(config.remotes).forEach(([key, remote]) => {
    remote.id = hash_sum(key);
  });
  // eslint-disable-next-line no-underscore-dangle
  config.module = plugin._options || {};
  config.name = config.name || config.module.name;
  config.environment = config.environment
    ? {
        [config.name || 'unknown']: config.environment,
      }
    : {};
};

const validate = (config: AppshellConfig) => {
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
};

const generateManifestTemplate = async (
  appshellConfigPath: string,
  webpackConfigPath: string,
  webpackEnv: Record<string, string | number>,
  webpackArgs: Record<string, string | number>,
) => {
  // eslint-disable-next-line no-console
  console.log(
    `generating appshell manifest template --appshellConfigPath=${appshellConfigPath} --webpackConfigPath=${webpackConfigPath}`,
  );
  const configPath = path.resolve(appshellConfigPath);
  const webpackConfig = await loadWebpackConfig(webpackConfigPath, webpackEnv, webpackArgs);
  const config = utils.load<AppshellConfig>(configPath);
  const plugin = findModuleFederationPlugin(webpackConfig);

  if (!plugin) {
    throw new Error('Webpack ModuleFederationPlugin is required to use this plugin.');
  }

  prepare(config, plugin);
  validate(config);

  return config;
};

/**
 * Generates an appshell manifest
 * @param configPath path of the appshell config to compile into an appshell manifest
 * @param webpackConfig path of the webpack config
 * @returns an appshell manifest
 */
export default async <TMetadata extends Record<string, unknown>>(
  configPath: string,
  webpackConfig = 'webpack.config.js',
  webpackEnv = {},
  webpackArgs = {},
) => {
  if (!fs.existsSync(configPath)) {
    // eslint-disable-next-line no-console
    console.log(`No config file found '${configPath}'`);

    return null;
  }

  const template = await generateManifestTemplate(
    configPath,
    webpackConfig,
    webpackEnv,
    webpackArgs,
  );
  const configMap = configmap.create(template);

  return toAppshellManifest<TMetadata>(template, configMap);
};
