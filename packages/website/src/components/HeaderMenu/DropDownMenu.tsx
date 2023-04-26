import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export interface DropDownMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  readonly open?: boolean;
  readonly children: React.ReactNode | React.ReactNode[];
}

const Menu = styled.ul<{ $open?: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  flex-flow: column;
  position: absolute;
  min-width: 12em;
  visibility: hidden;
  opacity: 0;
  background-color: #fff;
  list-style: none;
  border-radius: 0.3em;
  box-shadow: 0 0.6em 1.4em rgb(0 0 0 / 30%);
  transition: opacity 120ms ease-out, margin-top 120ms ease-out;
  text-align: left;
  ${props =>
    props.$open &&
    css`
      opacity: 1;
      visibility: visible;
      transition: opacity 240ms ease-out, margin-top 240ms ease-out;
    `}
`;

const DropDownMenu: React.ForwardRefRenderFunction<HTMLUListElement, DropDownMenuProps> = (
  props,
  ref,
) => {
  const { open, children, ...otherProps } = props;

  return (
    <Menu $open={open} {...otherProps} ref={ref}>
      {children}
    </Menu>
  );
};

export default React.forwardRef(DropDownMenu);
