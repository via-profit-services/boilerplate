import React from 'react';
import { graphql, useFragment } from 'react-relay';

import fragmentSpec, {
  TemplateBlogHeading$key,
} from '~/relay/artifacts/TemplateBlogHeading.graphql';
import H1 from '@boilerplate/ui-kit/src/Typography/H1';
import ContentBlockPlainText from '~/components/ContentBlock/ContentBlockPlainText';

interface TemplateBlogHeadingProps {
  readonly fragmentRef: TemplateBlogHeading$key | null;
}

const TemplateBlogHeading: React.FC<TemplateBlogHeadingProps> = props => {
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

export default TemplateBlogHeading;

graphql`
  fragment TemplateBlogHeading on TemplateBlogPage {
    heading {
      __typename
      ...ContentBlockPlainTextFragment
    }
  }
`;
