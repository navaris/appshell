import { AppshellRemote } from '@appshell/config';
import React, { FC } from 'react';
import styled from 'styled-components';

const Json = styled.textarea`
  width: 100%;
  min-height: 30rem;
  font-size: 0.7rem;
  line-height: 1.2;
  background: transparent;
  color: white;
  resize: none;
  border-radius: 3px;
  border-color: rgba(0, 0, 0, 0.4);
  padding: 8px;
`;

type RemoteProps = {
  remote: AppshellRemote;
};

const Remote: FC<RemoteProps> = ({ remote }) => (
  <Json readOnly value={JSON.stringify(remote, null, 2)} />
);

export default Remote;
