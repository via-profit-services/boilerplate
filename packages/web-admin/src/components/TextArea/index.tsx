import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { v4 as uuidv4 } from 'uuid';

type StandardInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type TextAreaProps = StandardInputProps & {
  error?: boolean;
  errorText?: React.ReactNode;
  fullWidth?: boolean;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  label?: React.ReactNode;
};

const Container = styled.div<{ $fullWidth?: boolean }>`
  position: relative;
  display: flex;
  flex-flow: column;
  min-width: ${props => (props.$fullWidth ? '100%' : '200px')};
`;

const Label = styled.label<{ $error?: boolean }>`
  font-size: 0.8em;
  margin-left: 0.5em;
  margin-bottom: 0.2em;
  color: ${props => (props.$error ? 'red' : 'currentColor')};
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.8em;
  margin-left: 0.5em;
  position: absolute;
  bottom: -1.1em;
`;

const Input = styled.textarea<{ $error?: boolean }>`
  padding: 0.68rem 1rem;
  border-radius: 2em;
  border: 2px solid grey;
  width: 100%;
  min-height: 100px;
  resize: none;
  font-size: 0.9rem;
  ${props =>
    props.$error &&
    css`
      border-color: red;
      color: red;
      &:focus {
        border-color: red;
      }
    `}
`;

const TextArea: React.ForwardRefRenderFunction<HTMLDivElement, TextAreaProps> = (props, ref) => {
  const { error, fullWidth, inputRef, label, id, errorText, ...inputProps } = props;
  const inputID = id || uuidv4();

  return (
    <Container ref={ref} $fullWidth={fullWidth}>
      {label && (
        <Label htmlFor={inputID} $error={error}>
          {label}
        </Label>
      )}
      <Input {...inputProps} id={inputID} $error={error} ref={inputRef} />
      {errorText && <ErrorText>{errorText}</ErrorText>}
    </Container>
  );
};

export default React.forwardRef(TextArea);
