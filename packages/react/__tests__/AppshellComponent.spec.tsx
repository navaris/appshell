/** @jest-environment jsdom */
import * as remoteLoader from '@appshell/loader';
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import AppshellComponent from '../src/components/AppshellComponent';
import * as useGlobalConfig from '../src/hooks/useGlobalConfig';
import manifest from './fixtures/Manifest';
import TestComponent from './fixtures/TestComponent';
import config from './fixtures/TestGlobalConfig';

jest.mock('../src/hooks/useGlobalConfig');

const TestFallback = () => <div>loading...</div>;

describe('AppshellComponent', () => {
  it('should match snapshot', async () => {
    jest.spyOn(useGlobalConfig, 'default').mockReturnValue(config);
    jest.spyOn(remoteLoader, 'default').mockReturnValueOnce(async () => [TestComponent, manifest]);

    const { container, findByText } = await act(() =>
      render(<AppshellComponent remote="TestModule/TestComponent" />),
    );
    const view = await findByText(/test component/i);

    expect(view).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render fallback while resource is pending', async () => {
    jest.spyOn(useGlobalConfig, 'default').mockReturnValue(config);
    jest.spyOn(remoteLoader, 'default').mockReturnValueOnce(() => [null, null]);

    await act(() =>
      render(<AppshellComponent remote="TestModule/TestComponent" fallback={<TestFallback />} />),
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render error when resource fails', async () => {
    jest.spyOn(useGlobalConfig, 'default').mockReturnValue(config);
    jest
      .spyOn(remoteLoader, 'default')
      .mockImplementationOnce(() => new Error('Failed to get resource'));

    await act(() =>
      render(<AppshellComponent remote="TestModule/TestComponent" fallback={<TestFallback />} />),
    );

    expect(screen.getByText(/Error loading Appshell component/i)).toBeInTheDocument();
  });
});
