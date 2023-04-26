import * as React from 'react';
import styled from '@emotion/styled';

import ThemeModeSwitcher from '~/components/Sidebar/ThemeModeSwitcher';

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background.panel};
  border-top: ${({ theme }) => theme.borders.standard1};
  padding: 0 ${({ theme }) => theme.grid.frameGutter}px;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

type Props = React.HtmlHTMLAttributes<HTMLDivElement>;

const FooterBlock: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (props, ref) => (
  <Container {...props} ref={ref}>
    <ThemeModeSwitcher />
  </Container>
);

export default React.forwardRef(FooterBlock);
