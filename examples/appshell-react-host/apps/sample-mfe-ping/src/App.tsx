import { useManifest } from '@appshell/react-federated-component';
import React from 'react';
import { AppShowcase, PackageBlock, Remote } from 'react-appshell-host-components';
import pkg from '../package.json';

function App() {
  const manifest = useManifest();
  const remote = manifest.remotes['PingModule/App'];
  return (
    <AppShowcase header={<PackageBlock name={pkg.name} version={pkg.version} />}>
      <Remote remote={remote} />
    </AppShowcase>
  );
}

export default App;
