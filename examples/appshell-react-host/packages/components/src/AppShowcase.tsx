import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

const Header = styled.header`
  font-size: 24px;
`;

const Body = styled.div`
  display: flex;
  flex-grow: 1;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-width: 100%;
  align-content: center;
  min-width: 0px;
  min-height: 0px;
  flex-direction: column;
  width: 400px;
  padding: 0 24px 24px 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px;
  background: orangered;
`;

type AppShowcaseProps = {
  header: ReactNode | string;
  children: ReactNode;
};

const AppShowcase: FC<AppShowcaseProps> = ({ header, children }) => (
  <Wrapper>
    <Header>{header}</Header>
    <Body>{children}</Body>
  </Wrapper>
);

export default AppShowcase;
