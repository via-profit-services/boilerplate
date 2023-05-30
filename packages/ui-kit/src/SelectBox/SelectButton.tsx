import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Color from 'color';

import IconChevronDown from './IconChevronDown';

export type SelectButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly isOpen?: boolean;
  readonly fullWidth?: boolean;
};

const StyledButton = styled.button<{ $fullWidth?: boolean }>`
  display: flex;
  font-size: 1em;
  align-items: center;
  justify-content: space-between;
  outline: 1px solid transparent;
  box-shadow: none;
  text-align: left;
  padding: 0.8em 1em;
  cursor: pointer;
  outline: transparent;
  transition: all 180ms ease-out 0s;
  background: none;
  color: currentColor;
  max-width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '16em')};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
  border-color: ${({ theme }) =>
    theme.isDark
      ? Color(theme.colors.backgroundPrimary).lighten(1.4).rgb().string()
      : Color(theme.colors.backgroundPrimary).darken(0.4).rgb().string()};
  &:hover {
    background-color: ${({ theme }) =>
      Color(theme.colors.backgroundPrimary).darken(0.05).rgb().string()};
  }
  &:active {
    background-color: ${({ theme }) =>
      Color(theme.colors.backgroundPrimary).darken(0.1).rgb().string()};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accentPrimary};
  }
`;

const ValueWrapper = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  font-size: 0.86em;
  display: block;
  pointer-events: none;
`;

const ChevronWrapper = styled.span<{ $isOpen?: boolean }>`
  margin-left: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 120ms ease-out;
  pointer-events: none;
  transform: rotateZ(0);
  ${({ $isOpen }) =>
    $isOpen &&
    css`
      transform: rotateZ(180deg);
    `}
`;

const SelectButton: React.ForwardRefRenderFunction<HTMLButtonElement, SelectButtonProps> = (
  props,
  ref,
) => {
  const { children, isOpen, fullWidth, ...nativeProps } = props;

  return (
    <StyledButton type="button" $fullWidth={fullWidth} {...nativeProps} ref={ref}>
      <ValueWrapper>{children}</ValueWrapper>
      <ChevronWrapper $isOpen={isOpen}>
        <IconChevronDown />
      </ChevronWrapper>
    </StyledButton>
  );
};

export default React.forwardRef(SelectButton);
