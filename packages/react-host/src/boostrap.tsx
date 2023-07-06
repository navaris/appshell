/* eslint-disable react/jsx-props-no-spreading */
import { APPSHELL_ENV } from '@appshell/core';
import { ReactHost } from '@appshell/react-federated-component';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Splash from './components/Splash';
import reportWebVitals from './reportWebVitals';
import './reset.css';

const root = createRoot(document.getElementById('root') as HTMLElement);
const props = JSON.parse(APPSHELL_ENV.APPSHELL_ROOT_PROPS);

root.render(
  <React.StrictMode>
    <ReactHost
      indexUrl={APPSHELL_ENV.APPSHELL_INDEX_URL}
      remote={APPSHELL_ENV.APPSHELL_ROOT}
      fallback={<Splash />}
      {...props}
    />
  </React.StrictMode>,
);

reportWebVitals();
