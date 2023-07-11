/** @jest-environment jsdom */
/* eslint-disable no-underscore-dangle */
import { render } from '@testing-library/react';
import React from 'react';

declare global {
  interface Window {
    __appshell_env__: Record<string, string | undefined>;
  }
}

jest.mock('@appshell/core', () => ({
  APPSHELL_ENV: {
    APPSHELL_ROOT: 'TestModule/TestComponent',
    APPSHELL_THEME_COLOR: '#000000',
    APPSHELL_PRIMARY_COLOR: 'orangered',
  },
}));

describe('Splash', () => {
  let Splash;

  beforeEach(() => {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    Splash = require('../src/components/Splash').default;
  });

  it('should match snapshot', () => {
    const { container } = render(<Splash />);

    expect(container).toMatchSnapshot();
  });
});
