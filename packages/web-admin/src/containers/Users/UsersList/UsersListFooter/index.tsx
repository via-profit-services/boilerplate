import * as React from 'react';
import styled from '@emotion/styled';

import SearchField from './SearchField';
import OrderByButton from './OrderByButton';
import ResetButton from './ResetButton';

const Footer = styled.footer`
  background: ${({ theme }) => theme.color.surface.toString()};
  height: 4.4rem;
  display: flex;
  align-items: center;
  & button {
    margin: 0 0.5em;
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
`;

const UsersListFooter: React.FC = () => (
  <Footer>
    <Toolbar>
      <ResetButton />
      <OrderByButton />
      <SearchField />
    </Toolbar>
  </Footer>
);

export default UsersListFooter;
