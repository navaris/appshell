/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ErrorMessage from '../src/components/ErrorMessage';

describe('ErrorMessage', () => {
  it('should match snapshot', () => {
    const view = render(<ErrorMessage message="Failed to do something!" />);

    expect(view).toMatchSnapshot();
  });

  it('should render message', async () => {
    render(<ErrorMessage message="Failed to do something!" />);

    await expect(screen.getByText(/failed to do something/i)).toBeInTheDocument();
  });
});
