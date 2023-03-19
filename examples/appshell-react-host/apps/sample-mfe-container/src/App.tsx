import { FederatedComponent } from '@appshell/react-federated-component';
import React from 'react';
import { PackageBlock } from 'react-appshell-host-components';
import Loading from 'react-spinners/MoonLoader';
import styled from 'styled-components';
import pkg from '../package.json';
import appshellLogo from './assets/appshell-logo.svg';
import reactLogo from './assets/react-logo.svg';
import webpackLogo from './assets/webpack-logo.svg';

const AppContainer = styled.div`
  text-align: center;
`;

const Header = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const Grid = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-auto-flow: column;
`;

const Logo = styled.img`
  height: 12vmin;
  pointer-events: none;
`;

const Link = styled.a`
  color: #61dafb;
`;

const Plus = styled.div`
  display: flex;
  align-self: center;
  font-size: 48px;

  &:after {
    content: '+';
  }
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <PackageBlock name={pkg.name} version={pkg.version} />
        <Grid>
          <Link href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            <Logo src={reactLogo} alt="react" />
          </Link>
          <Plus />
          <Link
            href="https://github.com/navaris/appshell"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Logo src={appshellLogo} alt="appshell" />
          </Link>
          <Plus />
          <Link href="https://webpack.js.org/" target="_blank" rel="noopener noreferrer">
            <Logo src={webpackLogo} alt="webpack" />
          </Link>
        </Grid>
        <pre>This application is composed from 3 micro-frontends.</pre>
        <Grid>
          <FederatedComponent remote="PingModule/App" fallback={<Loading color="orangered" />} />
          <FederatedComponent remote="PongModule/App" fallback={<Loading color="orangered" />} />
        </Grid>
      </Header>
    </AppContainer>
  );
}

export default App;
