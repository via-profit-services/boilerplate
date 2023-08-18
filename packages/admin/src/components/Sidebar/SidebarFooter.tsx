import * as React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 0 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
`;

export type SidebarFooterProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const SidebarFooterWithRef: React.ForwardRefRenderFunction<HTMLDivElement, SidebarFooterProps> = (
  props,
  ref,
) => {
  const { children, ...restProps } = props;

  return (
    <Container {...restProps} ref={ref}>
      {children}
    </Container>
  );
};

export const SidebarFooter = React.forwardRef(SidebarFooterWithRef);

export default SidebarFooter;
