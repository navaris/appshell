const { container } = require('webpack');
const ReactRefreshSingleton = require('single-react-refresh-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (env, { mode }) => {
  const isDevelopment = mode === 'development';

  return {
    entry: './src/index',
    mode,
    output: {
      publicPath: 'auto',
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
    plugins: [
      isDevelopment && new ReactRefreshWebpackPlugin(),
      new container.ModuleFederationPlugin({
        name: 'TestModule',
        exposes: {
          './Foo': './src/Foo',
          './Bar': './src/Bar',
        },
        filename: 'remoteEntry.js',
        shared: {},
      }),
      isDevelopment && new ReactRefreshSingleton(),
    ].filter(Boolean),
  };
};
