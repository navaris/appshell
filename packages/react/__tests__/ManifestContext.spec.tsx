/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ManifestProvider } from '../src/contexts/ManifestContext';
import useManifest from '../src/hooks/useManifest';
import manifest from './fixtures/Manifest';
import TestComponent from './fixtures/TestComponent';

const ComponentUsingManifest = () => {
  const res = useManifest();

  return <div>{JSON.stringify(res.remotes)}</div>;
};

describe('ManifestProvider', () => {
  it('should render children', async () => {
    render(
      <ManifestProvider manifest={manifest}>
        <TestComponent />
      </ManifestProvider>,
    );

    await expect(screen.getByText(/test component/i)).toBeInTheDocument();
  });

  it('should make the manifest context available', async () => {
    render(
      <ManifestProvider manifest={manifest}>
        <ComponentUsingManifest />
      </ManifestProvider>,
    );

    await expect(screen.getByText(/TestModule\/TestComponent/i)).toBeInTheDocument();
  });
});
