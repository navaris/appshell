import { APPSHELL_ENV } from '@appshell/core';
import React from 'react';
import Loading from 'react-spinners/PropagateLoader';

const Splash = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
      height: '100vh',
      backgroundColor: APPSHELL_ENV.APPSHELL_THEME_COLOR,
    }}
  >
    <Loading color={APPSHELL_ENV.APPSHELL_PRIMARY_COLOR} speedMultiplier={1.5} size={24} />
  </div>
);

export default Splash;
