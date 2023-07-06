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
    entry: './src/Ping',
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
        watch: {
          ignored: [/node_modules/, /dist/],
        },
      },
      port: process.env.SAMPLE_MFE_PING_PORT,
    },
    output: {
      publicPath: 'auto',
      uniqueName: `sample-mfe-ping`,
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
      ],
    },
    plugins: [
      new container.ModuleFederationPlugin({
        name: 'PingModule',
        exposes: {
          './Ping': './src/Ping',
        },
        filename: process.env.REMOTE_ENTRY_PATH,
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
      new AppshellManifestPlugin(),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      isDevelopment && new ReactRefreshSingleton(),
    ].filter(Boolean),
  };
};
