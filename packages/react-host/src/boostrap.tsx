import React from 'react';
import { createRoot } from 'react-dom/client';
import RenderHost from './components/RenderHost';
import Splash from './components/Splash';
import reportWebVitals from './reportWebVitals';
import './reset.css';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <React.Suspense fallback={<Splash />}>
      <RenderHost />
    </React.Suspense>
  </React.StrictMode>,
);

reportWebVitals();
