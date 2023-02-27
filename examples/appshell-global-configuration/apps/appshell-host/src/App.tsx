import { AppshellManifest } from '@navaris/appshell-manifest-webpack-plugin';
import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.svg';

function App() {
  const [manifest, setManifest] = useState<AppshellManifest>();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setFetching(true);
      const res = await fetch('appshell.manifest.json', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        setManifest(data);
      }
    };

    if (!manifest && !fetching) {
      fetchConfig();
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h3>Appshell manifest</h3>
        <div className="appshell-manifest">
          <pre>{manifest ? JSON.stringify(manifest, null, 2) : null}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
