import * as React from 'react';
import styled from '@emotion/styled';

export interface TextFieldLabelAsteriskProps extends React.HTMLAttributes<HTMLSpanElement> {
  readonly error?: boolean;
  readonly focused?: boolean;
}

const Asterisk = styled.span<{ $error?: boolean; $focused?: boolean }>`
  font-size: 0.8em;
  margin-left: 0.2em;
  color: ${({ theme }) => theme.colors.error};
`;

const TextFieldLabelAsterisk: React.ForwardRefRenderFunction<
  HTMLLabelElement,
  TextFieldLabelAsteriskProps
> = (props, ref) => {
  const { children, error, focused, ...otherProps } = props;

  return (
    <Asterisk {...otherProps} ref={ref} $error={error} $focused={focused}>
      {children}
    </Asterisk>
  );
};

export default React.forwardRef(TextFieldLabelAsterisk);
