import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  readonly position: 'left' | 'right';
};

type AsideStyleProps = {
  readonly $position: SidebarProps['position'];
};

const Aside = styled.aside<AsideStyleProps>`
  display: flex;
  flex-flow: column;
  width: 13rem;
  height: 100%;
  background: ${({ theme }) => theme.color.surface.toString()};
  color: ${({ theme }) => theme.color.textPrimary.toString()};
  z-index: ${({ theme }) => theme.zIndex.sidebar};
  ${({ $position, theme }) => {
    switch ($position) {
      case 'left':
      default:
        return css`
          border-right: 1px solid;
          border-right-color: ${theme.color.surface.darken(15).toString()};
        `;
      case 'right':
        return css`
          border-left: 1px solid;
          border-left-color: ${theme.color.surface.darken(15).toString()};
        `;
    }
  }}
`;

const SidebarWithRef: React.ForwardRefRenderFunction<HTMLDivElement, SidebarProps> = (
  props,
  ref,
) => {
  const { children, position, ...restProps } = props;

  return (
    <Aside {...restProps} $position={position} ref={ref}>
      {children}
    </Aside>
  );
};

export const Sidebar = React.forwardRef(SidebarWithRef);

export default Sidebar;
