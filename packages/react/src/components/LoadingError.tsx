import React, { FC } from 'react';

type ErrorProps = {
  remote: string;
  reason: string;
};

const LoadingError: FC<ErrorProps> = ({ remote, reason }) => (
  <div style={{ border: '3px solid red' }}>
    <h5>{`Error loading federated component '${remote}.'`}</h5>
    <span style={{ fontSize: '1rem' }}>{reason}</span>
  </div>
);

export default LoadingError;
