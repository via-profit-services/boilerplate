import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export interface TextFieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly hasStartIcon: boolean;
  readonly hasEndIcon: boolean;
}

const Input = styled.input<{
  readonly $hasStartIcon: boolean;
  readonly $hasEndIcon: boolean;
}>`
  font-size: 1em;
  padding: 1em 1.2em;
  ${({ $hasStartIcon }) =>
    $hasStartIcon &&
    css`
      padding-left: 0;
    `};
  ${({ $hasEndIcon }) =>
    $hasEndIcon &&
    css`
      padding-right: 0;
    `};
  background: none;
  border-radius: inherit;
  margin: 0;
  border: 0;
  width: 100%;
  color: currentColor;
  &:focus {
    outline: none;
  }
  &::placeholder {
    font-style: italic;
  }
`;

const TextFieldInput: React.ForwardRefRenderFunction<HTMLInputElement, TextFieldInputProps> = (
  props,
  ref,
) => {
  const { hasEndIcon, hasStartIcon } = props;

  return <Input $hasEndIcon={hasEndIcon} $hasStartIcon={hasStartIcon} {...props} ref={ref} />;
};

export default React.forwardRef(TextFieldInput);
