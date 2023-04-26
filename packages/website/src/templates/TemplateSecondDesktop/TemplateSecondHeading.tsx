import React from 'react';
import { graphql, useFragment } from 'react-relay';

import fragmentSpec, {
  TemplateSecondHeading$key,
} from '~/relay/artifacts/TemplateSecondHeading.graphql';
import H1 from '~/components/Typography/H1';
import ContentBlockPlainText from '~/components/ContentBlock/ContentBlockPlainText';

interface TemplateSecondHeadingProps {
  readonly fragmentRef: TemplateSecondHeading$key | null;
}

const TemplateSecondHeading: React.FC<TemplateSecondHeadingProps> = props => {
  const { fragmentRef } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);

  if (!fragment || !fragment.heading) {
    return null;
  }

  return (
    <H1>
      <ContentBlockPlainText fragmentRef={fragment.heading} />
    </H1>
  );
};

export default TemplateSecondHeading;

graphql`
  fragment TemplateSecondHeading on TemplateSecondPage {
    heading {
      __typename
      ...ContentBlockPlainTextFragment
    }
  }
`;
