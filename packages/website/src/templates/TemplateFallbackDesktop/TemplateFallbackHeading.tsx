import React from 'react';
import { graphql, useFragment } from 'react-relay';

import fragmentSpec, {
  TemplateFallbackHeading$key,
} from '~/relay/artifacts/TemplateFallbackHeading.graphql';
import H1 from '@boilerplate/ui-kit/src/Typography/H1';
import ContentBlockPlainText from '~/components/ContentBlock/ContentBlockPlainText';

interface TemplateFallbackHeadingProps {
  readonly fragmentRef: TemplateFallbackHeading$key | null;
}

const TemplateFallbackHeading: React.FC<TemplateFallbackHeadingProps> = props => {
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

export default TemplateFallbackHeading;

graphql`
  fragment TemplateFallbackHeading on TemplateFallbackPage {
    heading {
      __typename
      ...ContentBlockPlainTextFragment
    }
  }
`;
