/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import chalk from 'chalk';
import ejs from 'ejs';
import express from 'express';
import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';
const port = process.env.APPSHELL_PORT || 9000;
const app = express();

if (isDevelopment) {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config');

  const config = webpackConfig(null, { mode: process.env.NODE_ENV });
  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    }),
  );

  app.use(webpackHotMiddleware(compiler));
}

// Serve static files from the 'dist' directory
app.use(express.static(__dirname));

app.engine('.html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('*', (req, res) => {
  res.render('index', {
    favIcon: process.env.APPSHELL_FAVICON || '/favicon.ico',
    title: process.env.APPSHELL_TITLE || 'Appshell',
    description: process.env.APPSHELL_DESCRIPTION || 'Appshell is awesome!',
    publicUrl: path.join(process.env.APPSHELL_PUBLIC_URL || '', '/'),
    themeColor: process.env.APPSHELL_THEME_COLOR,
    stylesheetUrl: process.env.APPSHELL_STYLESHEET_URL,
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    chalk.cyan(`Appshell host listening on port ${port} in ${process.env.NODE_ENV} mode`),
  );
});
