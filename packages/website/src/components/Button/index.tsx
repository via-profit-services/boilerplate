import React from 'react';

import ButtonStandard, { ButtonStandardProps } from '@boilerplate/ui-kit/src/Button/ButtonStandard';
import ButtonAccent, { ButtonAccentProps } from '@boilerplate/ui-kit/src/Button/ButtonAccent';

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
