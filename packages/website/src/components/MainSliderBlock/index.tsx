import React from 'react';
import styled from '@emotion/styled';
import { graphql, useFragment } from 'react-relay';

import Slider, { SliderBullets, SliderRefType } from '~/components/Slider';
import Slide from './Slide';
import fragmentSpec, {
  MainSliderBlockFragment$key,
} from '~/relay/artifacts/MainSliderBlockFragment.graphql';

export interface MainSliderPlockProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly fragmentRef: MainSliderBlockFragment$key;
}

const Container = styled.section`
  position: relative;
`;

const MainSliderBlock: React.ForwardRefRenderFunction<HTMLDivElement, MainSliderPlockProps> = (
  props,
  ref,
) => {
  const { fragmentRef, ...divProps } = props;
  const { slides } = useFragment(fragmentSpec, fragmentRef);
  const sliderRef = React.useRef<SliderRefType | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleToIndex = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <Container {...divProps} ref={ref}>
      <Slider
        slidesToShow={1}
        pauseOnHover={false}
        ref={sliderRef}
        beforeChange={(_oldIndex, newIndex) => setActiveIndex(newIndex)}
      >
        {slides.map(slideFragment => (
          <Slide fragmentRef={slideFragment} key={slideFragment.id} />
        ))}
      </Slider>
      <SliderBullets
        activeIndex={activeIndex}
        slidesCount={slides.length}
        onSlideChange={handleToIndex}
      />
    </Container>
  );
};

export default React.forwardRef(MainSliderBlock);

graphql`
  fragment MainSliderBlockFragment on Slider {
    slides {
      id
      ...SlideFragment
    }
  }
`;
