/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */

const _global = typeof self === 'undefined' ? global : self;
_global.__singleReactRefreshRuntime__ =
  // eslint-disable-next-line global-require
  _global.__singleReactRefreshRuntime__ || require('react-refresh/runtime?fromWrap=1');

module.exports = _global.__singleReactRefreshRuntime__;
