import * as React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 0 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  flex: 1;
`;

export type SidebarContentProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const SidebarContentWithRef: React.ForwardRefRenderFunction<HTMLDivElement, SidebarContentProps> = (
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

export const SidebarContent = React.forwardRef(SidebarContentWithRef);

export default SidebarContent;
