const { AppshellManifestPlugin } = require('@appshell/manifest-webpack-plugin');
const { container } = require('webpack');
const pkg = require('../../package.json');

module.exports = {
  eslint: null,
  webpack: {
    configure: (webpackConfig, arg) => {
      webpackConfig.output.publicPath = 'auto';
      webpackConfig.plugins.push(
        new container.ModuleFederationPlugin({
          exposes: {
            './App': './src/App',
          },
          filename: 'remoteEntry.js',
          name: 'CraModule',
          shared: {
            react: {
              singleton: true,
              requiredVersion: pkg.dependencies['react'],
            },
            'react-dom': {
              singleton: true,
              requiredVersion: pkg.dependencies['react-dom'],
            },
          },
        }),
      );
      webpackConfig.plugins.push(
        new AppshellManifestPlugin({
          configsDir: process.env.APPSHELL_CONFIGS_DIR,
        }),
      );

      return webpackConfig;
    },
  },
};
