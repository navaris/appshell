const { AppshellManifestPlugin } = require('@appshell/manifest-webpack-plugin');
const { container } = require('webpack');
const pkg = require('../../package.json');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './src/App',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: process.env.VANILLA_MFE_PORT,
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
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new container.ModuleFederationPlugin({
      exposes: {
        './Vanilla': './src/App',
        './CoolComponent': './src/CoolRemoteComponent',
      },
      filename: 'remoteEntry.js',
      name: 'VanillaModule',
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
    new AppshellManifestPlugin({
      configsDir: process.env.APPSHELL_CONFIGS_DIR,
    }),
  ],
};
