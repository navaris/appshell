const { AppshellManifestPlugin } = require('@appshell/manifest-webpack-plugin');
const { container } = require('webpack');
const { dependencies } = require('../../package.json');

module.exports = {
  eslint: null,
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = 'auto';
      webpackConfig.plugins.push(
        new container.ModuleFederationPlugin({
          name: 'PingModule',
          exposes: {
            './App': './src/App',
          },
          filename: 'remoteEntry.js',
          shared: {
            ...dependencies,
            react: {
              singleton: true,
              requiredVersion: dependencies['react'],
            },
            'react-dom': {
              singleton: true,
              requiredVersion: dependencies['react-dom'],
            },
            'react-refresh': {
              singleton: true,
              requiredVersion: dependencies['react-refresh'],
            },
            'styled-components': {
              singleton: true,
              requiredVersion: dependencies['styled-components'],
            },
            '@appshell/react-federated-component': {
              singleton: true,
              requiredVersion: false,
            },
          },
        }),
      );
      webpackConfig.plugins.push(
        new AppshellManifestPlugin({
          configsDir: process.env.CONFIGS_DIR,
        }),
      );

      return webpackConfig;
    },
  },
};
