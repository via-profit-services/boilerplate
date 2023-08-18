import * as React from 'react';
import styled from '@emotion/styled';

import ThemeModeSwitcher from '~/components/MainSidebar/ThemeModeSwitcher';

const Container = styled.div`
  padding: 0 1rem;
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
