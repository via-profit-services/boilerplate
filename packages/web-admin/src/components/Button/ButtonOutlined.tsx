import * as React from 'react';
import styled from '@emotion/styled';

import ButtonBase from './ButtonBase';

export type ButtonOutlinedColorVariant = 'default' | 'accent';

export interface ButtonOutlinedProps extends React.ComponentPropsWithoutRef<'button'> {
  readonly color?: ButtonOutlinedColorVariant;
  readonly children: React.ReactNode;
}

const Button = styled(ButtonBase)`
  background: none;
  border: 1px solid currentColor;
  border-radius: 1em;
`;

const ButtonOutlined: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonOutlinedProps> = (
  props,
  ref,
) => {
  const { children, ...otherProps } = props;

  return (
    <Button {...otherProps} ref={ref}>
      {children}
    </Button>
  );
};

export default React.forwardRef(ButtonOutlined);
