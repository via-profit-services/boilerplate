import React from 'react';

import ButtonStandard, { ButtonStandardProps } from './ButtonStandard';
import ButtonAccent, { ButtonAccentProps } from './ButtonAccent';

interface BaseProps {
  readonly variant?: 'standard' | 'accent';
}

export type ButtonProps = (ButtonStandardProps | ButtonAccentProps) & BaseProps;

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (props, ref) => {
  const { variant, ...buttonProps } = props;

  if (variant === 'accent') {
    return <ButtonAccent {...buttonProps} ref={ref} />;
  }

  return <ButtonStandard {...buttonProps} ref={ref} />;
};

export default React.forwardRef(Button);
