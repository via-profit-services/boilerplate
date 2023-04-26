import React from 'react';

import ButtonStandard, { ButtonStandardProps } from '~/components/Button/ButtonStandard';
import ButtonAccent, { ButtonAccentProps } from '~/components/Button/ButtonAccent';

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
