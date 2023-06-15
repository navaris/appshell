const { container } = require('webpack');
const path = require('path');
const { AppshellManifestPlugin } = require('@appshell/manifest-webpack-plugin');
const ReactRefreshSingleton = require('single-react-refresh-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { dependencies } = require('../../package.json');

module.exports = (env, { mode }) => {
  const isDevelopment = mode === 'development';

  return {
    entry: './src/Container',
    mode,
    devServer: {
      hot: true,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: process.env.SAMPLE_MFE_CONTAINER_PORT,
    },
    output: {
      publicPath: 'auto',
      uniqueName: `sample-mfe-container`,
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-react', '@babel/preset-typescript'],
                plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.svg$/,
          loader: 'url-loader',
          exclude: /node_modules/,
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
    plugins: [
      isDevelopment && new ReactRefreshWebpackPlugin(),
      new container.ModuleFederationPlugin({
        name: 'ContainerModule',
        exposes: {
          './Container': './src/Container',
        },
        filename: 'remoteEntry.js',
        shared: {
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
            requiredVersion: dependencies['@appshell/react-federated-component'],
          },
        },
      }),
      new AppshellManifestPlugin({
        configsDir: process.env.CONFIGS_DIR,
      }),
      isDevelopment && new ReactRefreshSingleton(),
    ].filter(Boolean),
  };
};
