import React from 'react';
import styled from '@emotion/styled';

import SliderBullet from './SliderBullet';

export interface BulletsProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly slidesCount: number;
  readonly activeIndex: number;
  readonly onSlideChange: (index: number) => void;
}

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  padding: 1em;
  position: absolute;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const SliderBulletsRef: React.ForwardRefRenderFunction<HTMLDivElement, BulletsProps> = (
  props,
  ref,
) => {
  const { slidesCount, onSlideChange, activeIndex, ...otherProps } = props;

  return (
    <Container ref={ref} {...otherProps}>
      {[...new Array(slidesCount).keys()].map((key, index) => (
        <SliderBullet
          key={key}
          isActive={index === activeIndex}
          onClick={() => onSlideChange(index)}
        />
      ))}
    </Container>
  );
};

export const SliderBullets = React.forwardRef(SliderBulletsRef);
export default SliderBullets;
