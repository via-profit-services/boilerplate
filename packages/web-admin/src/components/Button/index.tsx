import * as React from 'react';

import ButtonContained, { ButtonContainedProps } from '@boilerplate/ui-kit/src/Button/ButtonContained';
import ButtonOutlined, { ButtonOutlinedProps } from '@boilerplate/ui-kit/src/Button/ButtonOutlined';

interface BaseProps {
  readonly variant?: 'contained' | 'outlined';
}

export type ButtonProps = (ButtonContainedProps & BaseProps) | (ButtonOutlinedProps & BaseProps);

const isOutlined = (props: ButtonProps): props is ButtonOutlinedProps =>
  'variant' in props && props.variant === 'outlined';

const isContained = (props: ButtonProps): props is ButtonContainedProps =>
  ('variant' in props && props.variant === 'contained') || typeof props.variant === 'undefined';

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (props, ref) => {
  if (isContained(props)) {
    return <ButtonContained {...(props as any)} ref={ref} />;
  }

  if (isOutlined(props)) {
    return <ButtonOutlined {...(props as any)} ref={ref} />;
  }

  const { variant } = props;

  throw new Error(`Expected «variant» property is «outlined» or «contained», but got «${variant}»`);
};

export default React.forwardRef(Button);
