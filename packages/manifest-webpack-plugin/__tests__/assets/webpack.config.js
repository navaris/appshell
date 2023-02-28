const path = require('path');
const { MODULE_FEDERATION_PLUGIN_OPTIONS } = require('./module-federation-plugin-options');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { container } = require('webpack');

module.exports = {
  entry: './src/App',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: process.env.APPS_CATALOG_PORT,
  },
  output: {
    pathinfo: false,
    libraryTarget: 'umd',
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
            },
          },
        ],
      },
    ],
  },
  plugins: [new container.ModuleFederationPlugin(MODULE_FEDERATION_PLUGIN_OPTIONS)],
};
