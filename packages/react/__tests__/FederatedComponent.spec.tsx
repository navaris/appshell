/** @jest-environment jsdom */
import * as remoteLoader from '@appshell/loader';
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import FederatedComponent from '../src/components/FederatedComponent';
import * as useRegistry from '../src/hooks/useRegistry';
import index from './fixtures/appshell.index';
import manifest from './fixtures/Manifest';
import TestComponent from './fixtures/TestComponent';

jest.mock('../src/hooks/useRegistry');

const TestFallback = () => <div>loading...</div>;

describe('FederatedComponent', () => {
  it('should match snapshot', async () => {
    jest.spyOn(useRegistry, 'default').mockReturnValue(index);
    jest.spyOn(remoteLoader, 'default').mockReturnValueOnce(async () => [TestComponent, manifest]);

    const { container, findByText } = await act(() =>
      render(<FederatedComponent remote="TestModule/TestComponent" />),
    );
    const view = await findByText(/test component/i);

    expect(view).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render fallback while resource is pending', async () => {
    jest.spyOn(useRegistry, 'default').mockReturnValue(index);
    jest.spyOn(remoteLoader, 'default').mockReturnValueOnce(() => [null, null]);

    await act(() =>
      render(<FederatedComponent remote="TestModule/TestComponent" fallback={<TestFallback />} />),
    );

    await expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render error when resource fails', async () => {
    jest.spyOn(useRegistry, 'default').mockReturnValue(index);
    jest
      .spyOn(remoteLoader, 'default')
      .mockImplementationOnce(() => new Error('Failed to get resource'));

    await act(() =>
      render(<FederatedComponent remote="TestModule/TestComponent" fallback={<TestFallback />} />),
    );

    await expect(screen.getByText(/Error loading federated component/i)).toBeInTheDocument();
  });
});
