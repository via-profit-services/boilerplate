import React from 'react';
import { useTheme } from '@emotion/react';

import MockupBaseElement, { MockupBaseElementProps } from './MockupBaseElement';

export type MockupBackgroundElementProps = MockupBaseElementProps;

const MockupBackgroundElement: React.ForwardRefRenderFunction<
  HTMLDivElement,
  MockupBackgroundElementProps
> = (props, ref) => {
  const { width, height, color, children, ...otherProps } = props;
  const { isDark } = useTheme();

  return (
    <MockupBaseElement
      width={typeof width !== 'undefined' ? width : '6.25em'}
      height={typeof height !== 'undefined' ? height : '6.25em'}
      color={typeof color !== 'undefined' ? color : isDark ? '#424242' : '#f3f3f3'}
      {...otherProps}
      ref={ref}
    >
      {children}
    </MockupBaseElement>
  );
};

export default React.forwardRef(MockupBackgroundElement);
