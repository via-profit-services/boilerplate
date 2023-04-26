import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const MenuLink = styled(Link)`
  padding: 0.4em;
  display: inline-block;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
`;

const AppMenu: React.FC = () => (
  <MenuContainer>
    <MenuLink to="/">Home</MenuLink>
    <MenuLink to="/home-2">Home page 2</MenuLink>
    <MenuLink to="/blog">Blog</MenuLink>
    <MenuLink to="/404">404</MenuLink>
  </MenuContainer>
);

export default AppMenu;
