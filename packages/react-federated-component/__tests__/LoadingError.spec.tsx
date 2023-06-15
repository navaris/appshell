/** @jest-environment jsdom */
import { render } from '@testing-library/react';
import React from 'react';
import LoadingError from '../src/components/LoadingError';

describe('LoadingError', () => {
  it('should match snapshot', () => {
    const view = render(
      <LoadingError remote="TestModule/TestComponent" reason="Could not find component" />,
    );

    expect(view).toMatchSnapshot();
  });
});
