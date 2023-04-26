import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Color from 'color';

export type TextFieldWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  readonly error?: boolean;
  readonly fullWidth?: boolean;
  readonly readOnly?: boolean;
  readonly focused?: boolean;
};

const Wrapper = styled.div<{
  $error?: boolean;
  $readOnly?: boolean;
  $fullWidth?: boolean;
  $focused?: boolean;
}>`
  display: flex;
  align-items: stretch;
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
  border: 1px solid;
  outline: 1px solid transparent;
  border-color: ${({ theme }) =>
    theme.isDark
      ? Color(theme.colors.backgroundPrimary).lighten(1.4).rgb().string()
      : Color(theme.colors.backgroundPrimary).darken(0.4).rgb().string()};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  font-size: 0.9em;
  background-color: ${({ theme }) =>
    Color(theme.colors.backgroundPrimary).darken(0.02).rgb().string()};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all 180ms ease-out 0s;

  ${props =>
    props.$focused &&
    css`
      border-color: ${Color(props.theme.colors.accentPrimary).lighten(0.5).rgb().string()};
      outline-color: ${Color(props.theme.colors.accentPrimary).lighten(0.5).rgb().string()};
    `};
  ${props =>
    props.$error &&
    css`
      border-color: ${props.theme.colors.error};
      color: ${props.theme.colors.error};
      &:focus {
        border-color: ${Color(props.theme.colors.error).lighten(0.6).rgb().string()};
      }
    `}
`;

const TextFieldWrapper: React.ForwardRefRenderFunction<HTMLDivElement, TextFieldWrapperProps> = (
  props,
  ref,
) => {
  const { focused, error, readOnly, fullWidth, children, ...otherProps } = props;

  return (
    <Wrapper
      $error={error}
      $focused={focused}
      $readOnly={readOnly}
      $fullWidth={Boolean(fullWidth)}
      {...otherProps}
      ref={ref}
    >
      {children}
    </Wrapper>
  );
};

export default React.forwardRef(TextFieldWrapper);
