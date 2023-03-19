const { container } = require('webpack');
const path = require('path');
const { AppshellManifestPlugin } = require('@appshell/manifest-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin2');
const { dependencies, devDependencies } = require('../../package.json');

module.exports = (env, { mode }) => {
  const isDevelopment = mode === 'development';

  return {
    entry: './src/App',
    mode,
    devtool: isDevelopment ? 'eval-source-map' : false,
    devServer: {
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: process.env.SAMPLE_MFE_PONG_PORT,
    },
    output: {
      publicPath: 'auto',
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
        name: 'PongModule',
        exposes: {
          './App': './src/App',
          './CoolComponent': './src/CoolRemoteComponent',
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
      new AppshellManifestPlugin({
        configsDir: process.env.CONFIGS_DIR,
      }),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      isDevelopment && new Visualizer(),
    ].filter(Boolean),
  };
};
