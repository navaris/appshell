import { AppshellGlobalConfig } from 'packages/config/src/types';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import GlobalConfigContext from '../contexts/GlobalConfigContext';

export default (): AppshellGlobalConfig =>
  React.useContext<AppshellGlobalConfig>(GlobalConfigContext);
