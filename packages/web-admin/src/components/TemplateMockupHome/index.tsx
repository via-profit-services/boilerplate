import React from 'react';
import { graphql, useFragment } from 'react-relay';

import { MockupContainer } from '~/components/Mockup';
import TopDecorations from './TopDecorations';
import SectionHeader from './SectionHeader';
import SectionSlider from './SectionSlider';
import SectionTwo from './SectionTwo';
import SectionThree from './SectionThree';
import SectionFour from './SectionFour';
import fragmentSpec, {
  TemplateMockupHomeFragment$key,
} from '~/relay/artifacts/TemplateMockupHomeFragment.graphql';

export interface TemplateMockupHomeProps {
  readonly fragmentRef: TemplateMockupHomeFragment$key;
}

const TemplateMockupHome: React.FC<TemplateMockupHomeProps> = props => {
  const { fragmentRef } = props;
  const templateFragment = useFragment(fragmentSpec, fragmentRef);

  return (
    <MockupContainer>
      <TopDecorations />
      <SectionHeader />
      <SectionSlider />
      <SectionTwo fragmentRef={templateFragment} />
      <SectionThree />
      <SectionFour />
    </MockupContainer>
  );
};

export default TemplateMockupHome;

graphql`
  fragment TemplateMockupHomeFragment on TemplateHomePage {
    ...SectionTwoTemplateMockupHomeFragment
  }
`;
