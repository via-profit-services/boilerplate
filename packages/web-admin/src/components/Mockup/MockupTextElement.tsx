import React from 'react';
import { useTheme } from '@emotion/react';

import MockupBaseElement, { MockupBaseElementProps } from './MockupBaseElement';

export type MockupTextElementProps = MockupBaseElementProps;

const MockupTextElement: React.ForwardRefRenderFunction<HTMLDivElement, MockupTextElementProps> = (
  props,
  ref,
) => {
  const { width, height, color, children, ...otherProps } = props;
  const { isDark } = useTheme();

  return (
    <MockupBaseElement
      width={typeof width !== 'undefined' ? width : '100%'}
      height={typeof height !== 'undefined' ? height : '1em'}
      color={typeof color !== 'undefined' ? color : isDark ? '#424242' : '#d9d9d9'}
      {...otherProps}
      ref={ref}
    >
      {children}
    </MockupBaseElement>
  );
};

export default React.forwardRef(MockupTextElement);
