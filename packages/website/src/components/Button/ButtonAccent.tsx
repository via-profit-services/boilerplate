import React from 'react';
import styled from '@emotion/styled';
import Color from 'color';

import ButtonBase from './ButtonBase';

export type ButtonAccentProps = React.HTMLAttributes<HTMLButtonElement> & {
  readonly startIcon?: JSX.Element;
  readonly endIcon?: JSX.Element;
};

const Button = styled(ButtonBase)`
  color: ${({ theme }) => theme.colors.accentPrimaryContrast};
  background-color: ${({ theme }) => theme.colors.accentPrimary};
  box-shadow: 0 2px 12px
    ${({ theme }) => Color(theme.colors.accentPrimary).darken(0.6).alpha(0.3).rgb().string()};
  &:hover {
    background-color: ${({ theme }) =>
      Color(theme.colors.accentPrimary).darken(0.1).rgb().string()};
  }
  &:active {
    background-color: ${({ theme }) =>
      Color(theme.colors.accentPrimary).darken(0.2).rgb().string()};
  }
  &:focus-visible {
    outline: 2px solid
      ${({ theme }) => Color(theme.colors.accentPrimary).darken(0.3).rgb().string()};
  }
`;

const StartIconWrapper = styled.span`
  margin-right: 0.8em;
`;

const EndIconWrapper = styled.span`
  margin-left: 0.8em;
`;

const ButtonAccent: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonAccentProps> = (
  props,
  ref,
) => {
  const { children, startIcon, endIcon, ...otherProps } = props;

  return (
    <Button {...otherProps} ref={ref}>
      {typeof startIcon !== 'undefined' && startIcon !== null && (
        <StartIconWrapper>{startIcon}</StartIconWrapper>
      )}
      {children}
      {typeof endIcon !== 'undefined' && endIcon !== null && (
        <EndIconWrapper>{endIcon}</EndIconWrapper>
      )}
    </Button>
  );
};

export default React.forwardRef(ButtonAccent);
