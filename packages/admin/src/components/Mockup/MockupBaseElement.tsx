import React from 'react';
import styled from '@emotion/styled';

export interface MockupBaseElementProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly width?: string | number;
  readonly height?: string | number;
  readonly color?: string;
  readonly marginBottom?: string | number;
  readonly marginTop?: string | number;
  readonly marginLeft?: string | number;
  readonly marginRight?: string | number;
  readonly borderRadius?: string;
}

interface StyleProps {
  readonly $width?: string | number;
  readonly $height?: string | number;
  readonly $color?: string;
  readonly $marginBottom?: string | number;
  readonly $marginTop?: string | number;
  readonly $marginLeft?: string | number;
  readonly $marginRight?: string | number;
  readonly $borderRadius?: string;
}

const Container = styled.div<StyleProps>`
  margin: ${({ $marginBottom, $marginTop, $marginLeft, $marginRight }) => {
    const mBottom =
      typeof $marginBottom === 'string'
        ? $marginBottom
        : typeof $marginBottom === 'number'
        ? `${$marginBottom}px`
        : '0';

    const mTop =
      typeof $marginTop === 'string'
        ? $marginTop
        : typeof $marginTop === 'number'
        ? `${$marginTop}px`
        : '0';

    const mLeft =
      typeof $marginLeft === 'string'
        ? $marginLeft
        : typeof $marginLeft === 'number'
        ? `${$marginLeft}px`
        : '0';

    const mRight =
      typeof $marginRight === 'string'
        ? $marginRight
        : typeof $marginRight === 'number'
        ? `${$marginRight}px`
        : '0';

    return [mTop, mRight, mBottom, mLeft].join(' ');
  }};
  background-color: ${({ $color }) => (typeof $color === 'string' ? $color : 'transparent')};
  border-radius: ${({ $borderRadius }) =>
    typeof $borderRadius === 'string'
      ? $borderRadius
      : typeof $borderRadius === 'number'
      ? `${$borderRadius}px`
      : '1em'};
  width: ${({ $width }) =>
    typeof $width === 'string' ? $width : typeof $width === 'number' ? `${$width}px` : 'auto'};
  height: ${({ $height }) =>
    typeof $height === 'string' ? $height : typeof $height === 'number' ? `${$height}px` : 'auto'};
`;

const MockupBaseElement: React.ForwardRefRenderFunction<HTMLDivElement, MockupBaseElementProps> = (
  props,
  ref,
) => {
  const {
    width,
    height,
    color,
    marginBottom,
    marginTop,
    marginLeft,
    marginRight,
    borderRadius,
    children,
    ...nativeProps
  } = props;

  return (
    <Container
      $width={width}
      $height={height}
      $color={color}
      $marginBottom={marginBottom}
      $marginTop={marginTop}
      $marginLeft={marginLeft}
      $marginRight={marginRight}
      $borderRadius={borderRadius}
      {...nativeProps}
      ref={ref}
    >
      {children}
    </Container>
  );
};

export default React.forwardRef(MockupBaseElement);
