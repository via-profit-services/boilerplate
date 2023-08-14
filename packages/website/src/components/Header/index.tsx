import React from 'react';
import styled from '@emotion/styled';

import Menu from '~/components/AppMenu';
import SafeFrame from '~/components/SafeFrame';
import HeaderToolbar from '~/components/Header/HeaderToolbar';

export type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

const Container = styled.header`
  background-color: ${({ theme }) => theme.color.backgroundPrimary.toString()};
  color: ${({ theme }) => theme.color.textPrimary.toString()};
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  position: sticky;
  height: 3rem;
  top: 0;
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: 100%;
`;

const Inner = styled(SafeFrame)`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 auto;
`;

const Header: React.ForwardRefRenderFunction<HTMLDivElement, HeaderProps> = (props, ref) => {
  const { children, ...otherProps } = props;

  return (
    <Container {...otherProps} ref={ref}>
      <Inner>
        <Menu />
        <HeaderToolbar />
        {children}
      </Inner>
    </Container>
  );
};

export default React.forwardRef(Header);
