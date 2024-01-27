const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshSingleton = require('single-react-refresh-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { dependencies } = require('../../package.json');
const appshellReactPkg = require('../react/package.json');

module.exports = (env, { mode }) => {
  const isDevelopment = mode === 'development';

  return {
    entry: isDevelopment
      ? [
          'webpack-hot-middleware/client', // HMR entry point
          './src/index',
        ]
      : './src/index',
    mode,
    devtool: isDevelopment ? 'eval-source-map' : false,
    devServer: {
      hot: true,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
      compress: true,
      static: {
        directory: path.join(__dirname, 'dist'),
        watch: {
          ignored: [/node_modules/, /dist/],
        },
      },
      port: process.env.APPSHELL_PORT,
      historyApiFallback: true,
    },
    output: {
      publicPath: 'auto',
      uniqueName: `appshell-react-host`,
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
      new CopyPlugin({
        patterns: [
          { from: 'public/index.html', to: './views' },
          { from: 'public/favicon.ico', to: '.' },
          { from: 'public/manifest.json', to: '.' },
          { from: 'public/logo192.png', to: '.' },
          { from: 'public/logo512.png', to: '.' },
        ],
      }),
      new webpack.container.ModuleFederationPlugin({
        name: 'Appshell',
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
          '@appshell/react': {
            singleton: true,
            requiredVersion: appshellReactPkg.version,
          },
        },
      }),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      isDevelopment && new ReactRefreshSingleton(),
    ].filter(Boolean),
  };
};
