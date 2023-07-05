import { ManifestProvider } from '@appshell/react-federated-component';
import { act, render } from '@testing-library/react';
import React from 'react';
import Container from '../Container';
import manifest from './test.manifest.json';

jest.mock('../env', () => ({
  BACKGROUND_COLOR: 'red',
}));

test('should match snapshot', async () => {
  const { container } = await act(() =>
    render(
      <ManifestProvider manifest={manifest}>
        <Container />
      </ManifestProvider>,
    ),
  );

  expect(container).toMatchSnapshot();
});
