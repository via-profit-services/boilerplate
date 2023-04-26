import React from 'react';
import styled from '@emotion/styled';
import Color from 'color';

import ButtonBase from './ButtonBase';

export type ButtonStandardProps = React.HTMLAttributes<HTMLButtonElement> & {
  readonly startIcon?: JSX.Element;
  readonly endIcon?: JSX.Element;
};

const Button = styled(ButtonBase)`
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) =>
    theme.isDark
      ? Color(theme.colors.backgroundPrimary).lighten(0.2).rgb().string()
      : theme.colors.backgroundPrimary};
  box-shadow: 0 2px 12px
    ${({ theme }) => Color(theme.colors.backgroundPrimary).darken(0.1).alpha(0.6).rgb().string()};
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

const StartIconWrapper = styled.span`
  margin-right: 0.8em;
`;

const EndIconWrapper = styled.span`
  margin-left: 0.8em;
`;

const ButtonStandard: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonStandardProps> = (
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

export default React.forwardRef(ButtonStandard);
