import * as React from 'react';
import styled from '@emotion/styled';

import LogoutButton from './LogoutButton';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderToolbar: React.FC = () => (
  <Container>
    <LogoutButton />
  </Container>
);

export default HeaderToolbar;
