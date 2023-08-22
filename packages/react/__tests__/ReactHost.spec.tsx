/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import React from 'react';
import * as FederatedComponent from '../src/components/FederatedComponent';
import ReactHost from '../src/components/ReactHost';

enableFetchMocks();

jest.mock('@appshell/core', () => ({
  APPSHELL_ENV: {
    APPSHELL_REGISTRY: 'appshell_registry',
    APPSHELL_PUBLIC_URL: 'http://test.com',
    APPSHELL_ROOT: 'TestModule/TestComponent',
    APPSHELL_ROOT_PROPS: '{"foo":"bar"}',
  },
}));

jest.mock('../src/components/FederatedComponent', () => ({
  __esModule: true,
  default: () => <div>test component</div>,
}));

describe('RenderHost', () => {
  const registerUrl = 'http://test.com/appshell.register.json';
  const remote = 'TestModule/TestComponent';

  let useState: jest.SpyInstance;
  const mockUseState = (val) => {
    useState.mockImplementationOnce(() => [val, () => {}]);
  };

  beforeEach(() => {
    // useEffect = jest.spyOn(React, 'useEffect');
    useState = jest.spyOn(React, 'useState');
    fetch.mockIf(
      (req) => req.url === 'http://test.com/appshell.register.json',
      () => Promise.resolve({ ok: true, body: JSON.stringify({ test: 'data' }) }),
    );
  });

  afterEach(() => {
    useState.mockReset();
  });

  it('should match snapshot', async () => {
    mockUseState({ index: 'foo' });
    mockUseState({ metadata: 'bar' });
    const { container } = await act(() =>
      render(<ReactHost registerUrl={registerUrl} remote={remote} fallback="Loading" />),
    );

    expect(container).toMatchSnapshot();
  });

  it('should render empty when index is pending', async () => {
    mockUseState(undefined);
    mockUseState({ metadata: 'bar' });
    const { container } = render(
      <ReactHost registerUrl={registerUrl} remote={remote} fallback="Loading" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render empty when metadata is pending', async () => {
    mockUseState({ index: 'foo' });
    mockUseState(undefined);
    const { container } = render(
      <ReactHost registerUrl={registerUrl} remote={remote} fallback="Loading" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render component when index and metadata are available', async () => {
    mockUseState({ index: 'foo' });
    mockUseState({ metadata: 'bar' });
    await act(() =>
      render(<ReactHost registerUrl={registerUrl} remote={remote} fallback="Loading" />),
    );

    await expect(screen.getByText(/test component/i)).toBeInTheDocument();
  });

  it('should pass props to federated component when available', async () => {
    mockUseState({ index: 'foo' });
    mockUseState({ metadata: 'bar' });
    const federatedComponentSpy = jest.spyOn(FederatedComponent, 'default');
    await act(() =>
      render(<ReactHost registerUrl={registerUrl} remote={remote} foo="bar" fallback="Loading" />),
    );

    await expect(screen.getByText(/test component/i)).toBeInTheDocument();

    expect(federatedComponentSpy).toHaveBeenCalledWith(
      { fallback: 'Loading', foo: 'bar', remote: 'TestModule/TestComponent' },
      {},
    );
  });
});
