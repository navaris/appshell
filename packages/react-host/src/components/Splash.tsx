import React from 'react';
import Loading from 'react-spinners/PropagateLoader';
import env from '../runtime.env';

const Splash = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
      height: '100vh',
      backgroundColor: env.APPSHELL_THEME_COLOR,
    }}
  >
    <Loading color={env.APPSHELL_PRIMARY_COLOR} speedMultiplier={1.5} size={24} />
  </div>
);

export default Splash;
