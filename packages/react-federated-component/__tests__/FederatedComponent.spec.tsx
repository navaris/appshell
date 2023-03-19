/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import FederatedComponent from '../src/components/FederatedComponent';
import * as useManifest from '../src/hooks/useManifest';
import * as componentResource from '../src/resources/componentResource';
import manifest from './fixtures/Manifest';
import TestComponent from './fixtures/TestComponent';

jest.mock('../src/hooks/useManifest');
jest.mock('../src/resources/componentResource');

const TestFallback = () => <div>loading...</div>;

describe('FederatedComponent', () => {
  it('should match snapshot', () => {
    jest.spyOn(useManifest, 'default').mockReturnValue(manifest);
    jest.spyOn(componentResource, 'default').mockReturnValue({ read: () => TestComponent });

    const view = render(<FederatedComponent remote="TestModule/TestComponent" />);

    expect(view).toMatchSnapshot();
  });

  it('should render fallback while resource is pending', async () => {
    jest.spyOn(useManifest, 'default').mockReturnValue(manifest);
    jest.spyOn(componentResource, 'default').mockReturnValue({
      read: () => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw new Promise(() => {});
      },
    });

    await act(() =>
      render(<FederatedComponent remote="TestModule/TestComponent" fallback={<TestFallback />} />),
    );

    await expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render error when resource fails', async () => {
    jest.spyOn(useManifest, 'default').mockReturnValue(manifest);
    jest.spyOn(componentResource, 'default').mockReturnValue({
      read: () => new Error('Failed to get resource'),
    });

    await act(() =>
      render(<FederatedComponent remote="TestModule/TestComponent" fallback={<TestFallback />} />),
    );

    await expect(screen.getByText(/Error: Failed to get resource/i)).toBeInTheDocument();
  });
});
