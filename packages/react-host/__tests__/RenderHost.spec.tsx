/** @jest-environment jsdom */
import * as FederatedComponentModule from '@appshell/react-federated-component';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React, { ComponentType } from 'react';
import manifest from './fixtures/Manifest';

jest.mock('../src/runtime.env', () => ({
  APPSHELL_CONFIGS_DIR: 'appshell_configs',
  APPSHELL_MANIFEST_URL: 'http://test.com/manifest.json',
}));

type FederatedComponentModuleType = typeof FederatedComponentModule;

const resourceValue = jest.fn();
const TestComponent = () => <div>test component</div>;

describe('RenderHost', () => {
  let RenderHost: ComponentType;
  let federatedComponentModule: FederatedComponentModuleType;
  beforeEach(() => {
    // eslint-disable-next-line global-require
    federatedComponentModule = require('@appshell/react-federated-component');
    jest
      .spyOn(federatedComponentModule, 'jsonResource')
      .mockReturnValue({ read: () => resourceValue() });
    jest.spyOn(federatedComponentModule, 'FederatedComponent').mockImplementation(TestComponent);
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    RenderHost = require('../src/components/RenderHost').default;
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should match snapshot', () => {
    resourceValue.mockReturnValueOnce(manifest);
    const view = render(<RenderHost />);

    expect(view).toMatchSnapshot();
  });

  it('should render emptry when manifest is pending', async () => {
    resourceValue.mockReturnValueOnce(undefined);
    const view = render(<RenderHost />);

    expect(view).toMatchSnapshot();
  });

  it('should render component when manifest is available', async () => {
    resourceValue.mockReturnValueOnce(manifest);
    render(<RenderHost />);

    await expect(screen.getByText(/test component/i)).toBeInTheDocument();
  });

  it('should render error when manifest is available', async () => {
    resourceValue.mockReturnValueOnce(new Error('Failed to get resource.'));
    render(<RenderHost />);

    await expect(screen.getByText(/failed to get resource/i)).toBeInTheDocument();
  });
});
