import React from 'react';
import { graphql, useFragment } from 'react-relay';

import fragmentSpec, {
  TemplateBlogPostHeading$key,
} from '~/relay/artifacts/TemplateBlogPostHeading.graphql';
import H1 from '~/components/Typography/H1';
import ContentBlockPlainText from '~/components/ContentBlock/ContentBlockPlainText';

interface TemplateBlogPostHeadingProps {
  readonly fragmentRef: TemplateBlogPostHeading$key | null;
}

const TemplateBlogPostHeading: React.FC<TemplateBlogPostHeadingProps> = props => {
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

export default TemplateBlogPostHeading;

graphql`
  fragment TemplateBlogPostHeading on TemplateBlogPostPage {
    heading {
      __typename
      ...ContentBlockPlainTextFragment
    }
  }
`;
