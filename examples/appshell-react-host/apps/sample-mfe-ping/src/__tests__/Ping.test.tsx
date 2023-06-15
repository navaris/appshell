import { ManifestProvider } from '@appshell/react-federated-component';
import { render } from '@testing-library/react';
import React from 'react';
import Ping from '../Ping';
import manifest from './test.manifest.json';

test('should match snapshot', async () => {
  const { container } = render(
    <ManifestProvider manifest={manifest}>
      <Ping />
    </ManifestProvider>,
  );

  expect(container).toMatchSnapshot();
});
