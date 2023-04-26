import React from 'react';
import { graphql, useFragment } from 'react-relay';

import fragmentSpec, {
  ContentBlockPlainTextFragment$key,
} from '~/relay/artifacts/ContentBlockPlainTextFragment.graphql';

export interface ContentBlockPlainTextProps {
  readonly fragmentRef: ContentBlockPlainTextFragment$key | null;
}

const ContentBlockPlainText: React.FC<ContentBlockPlainTextProps> = props => {
  const { fragmentRef } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);

  if (!fragment) {
    return null;
  }

  return <>{fragment.text}</>;
};

export default ContentBlockPlainText;

graphql`
  fragment ContentBlockPlainTextFragment on ContentBlockPlainText {
    id
    text
  }
`;
