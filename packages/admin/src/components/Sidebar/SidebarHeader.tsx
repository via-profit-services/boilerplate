import React from 'react';
import styled from '@emotion/styled';

export type SidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const TopPanelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  padding: 0 0 0 1.5em;
`;

const SidebarHeaderWithRef: React.ForwardRefRenderFunction<HTMLDivElement, SidebarHeaderProps> = (
  props,
  ref,
) => {
  const { children, ...restProps } = props;

  return (
    <TopPanelContainer {...restProps} ref={ref}>
      {children}
    </TopPanelContainer>
  );
};

export const SidebarHeader = React.forwardRef(SidebarHeaderWithRef);

export default SidebarHeader;
