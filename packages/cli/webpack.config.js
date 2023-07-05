const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: '[name].js',
    pathinfo: false,
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  optimization: {
    chunkIds: 'named',
  },
  stats: {
    chunks: true,
    modules: false,
    chunkModules: true,
    chunkOrigins: true,
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
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
            },
          },
        ],
      },
    ],
  },
  plugins: [new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })],
  externals: {
    webpack: {
      commonjs: 'webpack',
      commonjs2: 'webpack',
      amd: 'webpack',
      root: 'Webpack',
    },
    esbuild: {
      commonjs: 'esbuild',
      commonjs2: 'esbuild',
      amd: 'esbuild',
      root: 'esbuild',
    },
  },
};
