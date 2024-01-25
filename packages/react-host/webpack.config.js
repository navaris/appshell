const path = require('path');
const { container, DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshSingleton = require('single-react-refresh-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { dependencies } = require('../../package.json');
const appshellReactPkg = require('../react/package.json');

module.exports = (env, { mode }) => {
  const isDevelopment = mode === 'development';

  return {
    entry: './src/index',
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
      new DefinePlugin({
        APPSHELL_TITLE: JSON.stringify(process.env.APPSHELL_TITLE),
        APPSHELL_DESCRIPTION: JSON.stringify(process.env.APPSHELL_DESCRIPTION),
        APPSHELL_PUBLIC_URL: JSON.stringify(process.env.APPSHELL_PUBLIC_URL),
        APPSHELL_THEME_COLOR: JSON.stringify(process.env.APPSHELL_THEME_COLOR),
        APPSHELL_STYLESHEET_URL: JSON.stringify(
          process.env.APPSHELL_STYLESHEET_URL ||
            'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
        ),
      }),
      new CopyPlugin({
        patterns: [
          { from: 'public/manifest.json', to: '.' },
          { from: 'public/logo192.png', to: '.' },
          { from: 'public/logo512.png', to: '.' },
          { from: 'serve.json', to: '.' },
        ],
      }),
      new HtmlWebpackPlugin({
        publicPath: path.join(process.env.APPSHELL_PUBLIC_URL || '', '/'),
        title: process.env.APPSHELL_TITLE,
        favicon: './public/favicon.ico',
        template: './public/index.html',
      }),
      new container.ModuleFederationPlugin({
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
      isDevelopment && new ReactRefreshWebpackPlugin(),
      isDevelopment && new ReactRefreshSingleton(),
    ].filter(Boolean),
  };
};
