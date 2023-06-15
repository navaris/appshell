/** @jest-environment jsdom */
import { render } from '@testing-library/react';
import React from 'react';
import Splash from '../src/components/Splash';

jest.mock('../src/runtime.env', () => ({
  APPSHELL_THEME_COLOR: '#000000',
  APPSHELL_PRIMARY_COLOR: 'orangered',
}));

describe('ErrorMessage', () => {
  it('should match snapshot', () => {
    const view = render(<Splash />);

    expect(view).toMatchSnapshot();
  });
});
