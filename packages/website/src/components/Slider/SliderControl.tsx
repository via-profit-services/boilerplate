import React from 'react';
import styled from '@emotion/styled';

import IconLeft from '~/components/Icons/IconChevronLeftCircle';
import IconRight from '~/components/Icons/IconChevronRightCircle';

export type Direction = 'prev' | 'next';

export interface SliderControlProps extends React.HTMLAttributes<HTMLButtonElement> {
  direction: Direction;
}

const Container = styled.button<{ direction: Direction }>`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  font-size: 2em;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: center;
  background: none;
  border: 0;
  width: auto;
  height: auto;
  cursor: pointer;
  z-index: 2;
`;

const SliderControlRef: React.ForwardRefRenderFunction<HTMLButtonElement, SliderControlProps> = (
  props,
  ref,
) => {
  const { direction, ...otherProps } = props;

  return (
    <Container direction={direction} ref={ref} {...otherProps}>
      {direction === 'prev' && <IconLeft />}
      {direction === 'next' && <IconRight />}
    </Container>
  );
};

export const SliderControl = React.forwardRef(SliderControlRef);
export default SliderControl;
