/* eslint-disable react/jsx-props-no-spreading */
import { FederatedComponent } from '@appshell/react-federated-component';
import React from 'react';
import env from '../runtime.env';
import Splash from './Splash';

const props = JSON.parse(env.APPSHELL_ROOT_PROPS);

const RenderHost = () => (
  <FederatedComponent remote={env.APPSHELL_ROOT} fallback={<Splash />} {...props} />
);

export default RenderHost;
