/** @jest-environment jsdom */
/* eslint-disable no-underscore-dangle */
import { render } from '@testing-library/react';
import React from 'react';

declare global {
  interface Window {
    __appshell_env__: Record<string, string | undefined>;
  }
}

Object.defineProperty(window, '__appshell_env__', {
  value: {
    APPSHELL_ROOT: 'TestModule/TestComponent',
    APPSHELL_THEME_COLOR: '#000000',
    APPSHELL_PRIMARY_COLOR: 'orangered',
  },
});
describe('Splash', () => {
  let Splash;

  beforeEach(() => {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    Splash = require('../src/components/Splash').default;
  });

  it('should match snapshot', () => {
    const view = render(<Splash />);

    expect(view).toMatchSnapshot();
  });
});
