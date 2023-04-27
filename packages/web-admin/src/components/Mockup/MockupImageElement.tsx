import React from 'react';
import { useTheme } from '@emotion/react';

import MockupBaseElement, { MockupBaseElementProps } from './MockupBaseElement';

export type MocupImageElementProps = MockupBaseElementProps & {
  readonly rounded?: boolean;
};

const MocupImageElement: React.ForwardRefRenderFunction<HTMLDivElement, MocupImageElementProps> = (
  props,
  ref,
) => {
  const { width, height, color, rounded, children, ...otherProps } = props;
  const { isDark } = useTheme();

  return (
    <MockupBaseElement
      width={typeof width !== 'undefined' ? width : '6.25em'}
      height={typeof height !== 'undefined' ? height : '6.25em'}
      color={typeof color !== 'undefined' ? color : isDark ? '#4b4b4b' : '#a3a1aa'}
      borderRadius={rounded ? '100%' : undefined}
      {...otherProps}
      ref={ref}
    >
      {children}
    </MockupBaseElement>
  );
};

export default React.forwardRef(MocupImageElement);
