import * as React from 'react';

import LogoInline, { LogoInlineProps } from '~/components/Logo/LogoInline';
import LogoRound, { LogoRoundProps } from '~/components/Logo/LogoRound';

export type LogoProps = LogoInlineProps | LogoRoundProps;

const isInline = (props: LogoProps): props is LogoInlineProps =>
  'variant' in props && props.variant === 'inline';

const isRounded = (props: LogoProps): props is LogoRoundProps =>
  'variant' in props && props.variant === 'round';

const Logo: React.ForwardRefRenderFunction<SVGSVGElement, LogoProps> = (props, ref) => {
  if (isInline(props)) {
    return <LogoInline {...props} ref={ref} />;
  }

  if (isRounded(props)) {
    return <LogoRound {...props} ref={ref} />;
  }

  const { variant } = props;

  throw new Error(`Expected «variant» property is «inline or «round», but got «${variant}»`);
};

export default React.forwardRef(Logo);
