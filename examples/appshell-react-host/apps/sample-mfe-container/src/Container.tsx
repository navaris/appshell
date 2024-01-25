import { AppshellComponent } from '@appshell/react';
import React from 'react';
import { PackageBlock } from 'react-appshell-host-components';
import Loading from 'react-spinners/MoonLoader';
import styled from 'styled-components';
import pkg from '../package.json';
import AppshellLogo from './assets/appshell-logo.svg';
import ReactLogo from './assets/react-logo.svg';
import WebpackLogo from './assets/webpack-logo.svg';
import env from './env';

const AppContainer = styled.div`
  text-align: center;
`;

const Header = styled.header`
  background-color: ${env.BACKGROUND_COLOR};
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

const Container = () => (
  <AppContainer>
    <Header>
      <PackageBlock name={pkg.name} version={pkg.version} />
      <Grid>
        <Link href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          <Logo src={ReactLogo} />
        </Link>
        <Plus />
        <Link href="https://github.com/navaris/appshell" target="_blank" rel="noopener noreferrer">
          <Logo src={AppshellLogo} />
        </Link>
        <Plus />
        <Link href="https://webpack.js.org/" target="_blank" rel="noopener noreferrer">
          <Logo src={WebpackLogo} />
        </Link>
      </Grid>
      <pre>This application is composed from 3 micro-frontends.</pre>
      <Grid>
        <AppshellComponent remote="PingModule/Ping" fallback={<Loading color="orangered" />} />
        <AppshellComponent remote="PongModule/Pong" fallback={<Loading color="orangered" />} />
      </Grid>
    </Header>
  </AppContainer>
);

export default Container;
