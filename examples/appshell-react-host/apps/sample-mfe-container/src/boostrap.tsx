import { AppshellManifest } from '@appshell/manifest-webpack-plugin';
import { jsonResource, ManifestProvider } from '@appshell/react-federated-component';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Container from './Container';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const resource = jsonResource<AppshellManifest>('appshell.manifest.json');

const RenderApp = () => {
  const manifest = resource.read();

  return manifest instanceof Error || !manifest ? null : (
    <ManifestProvider manifest={manifest}>
      <Container />
    </ManifestProvider>
  );
};

root.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <RenderApp />
    </React.Suspense>
  </React.StrictMode>,
);
