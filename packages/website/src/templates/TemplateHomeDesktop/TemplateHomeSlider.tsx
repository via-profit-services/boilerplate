import React from 'react';
import { graphql, useFragment } from 'react-relay';

import ErrorBoundary from '~/components/ErrorBoundary';
import MainSliderBlock from '~/components/MainSliderBlock';
import fragmentSpec, {
  TemplateHomeSliderFragment$key,
} from '~/relay/artifacts/TemplateHomeSliderFragment.graphql';

interface TemplateHomeSliderProps {
  readonly fragmentRef: TemplateHomeSliderFragment$key | null;
}

const TemplateHomeSlider: React.FC<TemplateHomeSliderProps> = props => {
  const { fragmentRef } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);

  if (!fragment || !fragment.slider) {
    return null;
  }

  return (
    <ErrorBoundary>
      <MainSliderBlock fragmentRef={fragment.slider} />
    </ErrorBoundary>
  );
};

export default TemplateHomeSlider;

graphql`
  fragment TemplateHomeSliderFragment on TemplateHomePage {
    slider {
      ...MainSliderBlockFragment
    }
  }
`;
