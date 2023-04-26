import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { v4 as uuidv4 } from 'uuid';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorText?: React.ReactNode;
  fullWidth?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  label?: React.ReactNode;
}

const Container = styled.div<{ $fullWidth?: boolean }>`
  position: relative;
  display: flex;
  flex-flow: column;
  min-width: ${props => (props.$fullWidth ? '100%' : '200px')};
`;

const Label = styled.label<{ $error?: boolean }>`
  font-size: 0.8em;
  margin-bottom: 0.2em;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.8em;
  margin-left: 0.5em;
`;

const Input = styled.input<{ $error?: boolean; $readOnly?: boolean }>`
  font-size: 0.9rem;
  padding: 0.68rem 1rem;
  border-radius: 0.4em;
  border: 1px solid #adadad;
  width: 100%;
  font-size: 0.9rem;
  background-color: #f7f7f7;
  color: ${props => (props.$readOnly ? 'rgb(114, 114, 124)' : 'rgb(31, 31, 54)')};
  outline: none;
  transition: all 180ms ease-out 0s;
  &:focus {
    border-color: rgb(255 200 131);
    background-color: #fff;
  }
  ${props =>
    props.$error &&
    css`
      border-color: #ff2b2b;
      color: red;
      &:focus {
        border-color: #ff2b2b;
      }
    `}
`;

const TextField: React.ForwardRefRenderFunction<HTMLDivElement, TextFieldProps> = (props, ref) => {
  const {
    error,
    fullWidth,
    inputRef,
    label,
    id,
    errorText,
    className,
    style,
    readOnly,
    ...inputProps
  } = props;
  const inputID = id || `id-${uuidv4()}`;

  return (
    <Container ref={ref} $fullWidth={fullWidth} className={className} style={style}>
      {label && (
        <Label htmlFor={inputID} $error={error}>
          {label}
        </Label>
      )}
      <Input
        {...inputProps}
        id={inputID}
        $error={error}
        ref={inputRef}
        readOnly={readOnly}
        $readOnly={readOnly}
      />
      {errorText && <ErrorText>{errorText}</ErrorText>}
    </Container>
  );
};

export default React.forwardRef(TextField);
