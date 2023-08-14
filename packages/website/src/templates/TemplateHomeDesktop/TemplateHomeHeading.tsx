import React from 'react';
import { graphql, useFragment } from 'react-relay';

import ErrorBoundary from '@via-profit/ui-kit/ErrorBoundary';
import SafeFrame from '~/components/SafeFrame';
import H1 from '@via-profit/ui-kit/Typography/H1';
import ContentBlockPlainText from '~/components/ContentBlock/ContentBlockPlainText';
import fragmentSpec, {
  TemplateHomeHeadingFragment$key,
} from '~/relay/artifacts/TemplateHomeHeadingFragment.graphql';

export interface TemplateHomeHeadingProps {
  readonly fragmentRef: TemplateHomeHeadingFragment$key;
}

const TemplateHomeHeading: React.FC<TemplateHomeHeadingProps> = props => {
  const { fragmentRef } = props;
  const { heading } = useFragment(fragmentSpec, fragmentRef);

  return (
    <ErrorBoundary>
      <SafeFrame>
        <H1>
          <ContentBlockPlainText fragmentRef={heading} />
        </H1>
      </SafeFrame>
    </ErrorBoundary>
  );
};

export default TemplateHomeHeading;

graphql`
  fragment TemplateHomeHeadingFragment on TemplateHomePage {
    heading {
      __typename
      ...ContentBlockPlainTextFragment
    }
  }
`;
