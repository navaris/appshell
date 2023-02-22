const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    main: './src/index.ts',
    generate: './src/generate.ts',
  },
  mode: 'development',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: '[name].js',
    pathinfo: false,
    libraryTarget: 'umd',
    globalObject: 'this',
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
  externals: {
    webpack: {
      commonjs: 'webpack',
      commonjs2: 'webpack',
      amd: 'webpack',
      root: 'Webpack',
    },
  },
};
