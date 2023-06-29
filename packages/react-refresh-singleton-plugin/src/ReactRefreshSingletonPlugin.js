/* eslint-disable no-param-reassign */

const PLUGIN_NAME = 'ReactRefreshSingletonPlugin';

class ReactRefreshSingletonPlugin {
  constructor() {
    this.wrapReactRefreshPath = require.resolve('./wrapReactRefreshRuntime.js');
  }

  apply(compiler) {
    this.interceptImport(compiler);
  }

  interceptImport(compiler) {
    compiler.options.resolve = compiler.options.resolve || {};
    compiler.options.resolve.alias = compiler.options.resolve.alias || {};
    compiler.options.resolve.alias['react-refresh/runtime'] = './$interceptReactRefresh';

    compiler.resolverFactory.hooks.resolver.for('normal').tap('name', (resolver) => {
      resolver.hooks.resolve.tap(PLUGIN_NAME, (request) => {
        const requestStr = request.request || '';
        if (requestStr.indexOf('react-refresh/runtime') > -1) {
          if (requestStr.indexOf('fromWrap=1') > -1) {
            const path = require.resolve('react-refresh/runtime');

            return {
              ...request,
              request: '',
              path,
              query: '',
            };
          }

          return {
            ...request,
            request: '',
            path: this.wrapReactRefreshPath,
            query: '',
          };
        }
        return undefined;
      });
    });
  }
}

module.exports = ReactRefreshSingletonPlugin;
