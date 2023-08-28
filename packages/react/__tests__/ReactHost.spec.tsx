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
  const configUrl = 'http://test.com/appshell.config.json';
  const remote = 'TestModule/TestComponent';

  let useState: jest.SpyInstance;
  const mockUseState = (val) => {
    useState.mockImplementationOnce(() => [val, () => {}]);
  };

  beforeEach(() => {
    useState = jest.spyOn(React, 'useState');
    fetch.mockIf(
      (req) => req.url === 'http://test.com/appshell.config.json',
      () => Promise.resolve({ ok: true, body: JSON.stringify({ test: 'data' }) }),
    );
  });

  afterEach(() => {
    useState.mockReset();
  });

  it('should match snapshot', async () => {
    mockUseState({ config: 'foo' });
    const { container } = await act(() =>
      render(<ReactHost configUrl={configUrl} remote={remote} fallback="Loading" />),
    );

    expect(container).toMatchSnapshot();
  });

  it('should render empty when config is pending', async () => {
    mockUseState(undefined);
    const { container } = render(
      <ReactHost configUrl={configUrl} remote={remote} fallback="Loading" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render component when config is available', async () => {
    mockUseState({ config: 'foo' });
    await act(() => render(<ReactHost configUrl={configUrl} remote={remote} fallback="Loading" />));

    expect(screen.getByText(/test component/i)).toBeInTheDocument();
  });

  it('should pass props to federated component when available', async () => {
    mockUseState({ config: 'foo' });
    const federatedComponentSpy = jest.spyOn(FederatedComponent, 'default');
    await act(() =>
      render(<ReactHost configUrl={configUrl} remote={remote} foo="bar" fallback="Loading" />),
    );

    expect(screen.getByText(/test component/i)).toBeInTheDocument();

    expect(federatedComponentSpy).toHaveBeenCalledWith(
      { fallback: 'Loading', foo: 'bar', remote: 'TestModule/TestComponent' },
      {},
    );
  });
});
