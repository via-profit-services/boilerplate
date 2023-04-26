import * as React from 'react';
import styled from '@emotion/styled';

export interface TextFieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  readonly error?: boolean;
  readonly focused?: boolean;
}

const Label = styled.label<{ $error?: boolean; $focused?: boolean }>`
  font-size: 0.8em;
  margin-bottom: 0.2em;
`;

const TextFieldLabel: React.ForwardRefRenderFunction<HTMLLabelElement, TextFieldLabelProps> = (
  props,
  ref,
) => {
  const { children, error, focused, ...otherProps } = props;

  return (
    <Label {...otherProps} ref={ref} $error={error} $focused={focused}>
      {children}
    </Label>
  );
};

export default React.forwardRef(TextFieldLabel);
