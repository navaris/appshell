const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin2');

module.exports = (env, { mode }) => {
  const isDevelopment = mode === 'development';

  return {
    entry: './src/index',
    mode,
    devtool: isDevelopment ? 'eval-source-map' : false,
    output: {
      filename: '[name].js',
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
    // plugins: [isDevelopment && new Visualizer()].filter(Boolean),
    externals: {
      react: 'react',
      'react-dom': 'reactDOM',
    },
  };
};
