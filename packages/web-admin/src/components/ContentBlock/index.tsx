import React from 'react';
import { graphql, useFragment } from 'react-relay';

import fragmentSpec, {
  ContentBlockFragment$key,
} from '~/relay/artifacts/ContentBlockFragment.graphql';
import ContentBlockPlainText from './ContentBlockPlainText';
import ContentBlockLexical from './ContentBlockLexical';
import ContentBlockImage from './ContentBlockImage';

export interface ContentBlockProps {
  readonly fragmentRef: ContentBlockFragment$key | null;
  readonly onUpdate: () => void;
}

const ContentBlock: React.FC<ContentBlockProps> = props => {
  const { fragmentRef, onUpdate } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);

  if (fragment === null) {
    return null;
  }

  if (fragment.__typename === 'ContentBlockPlainText') {
    return <ContentBlockPlainText fragmentRef={fragment} onUpdate={onUpdate} />;
  }
  if (fragment.__typename === 'ContentBlockLexical') {
    return <ContentBlockLexical fragmentRef={fragment} />;
  }
  if (fragment.__typename === 'ContentBlockImage') {
    return <ContentBlockImage fragmentRef={fragment} />;
  }

  return null;
};

export default ContentBlock;

graphql`
  fragment ContentBlockFragment on ContentBlock {
    __typename
    ... on ContentBlockPlainText {
      ...ContentBlockPlainTextFragment
    }
    ... on ContentBlockLexical {
      ...ContentBlockLexicalFragment
    }
    ... on ContentBlockImage {
      ...ContentBlockImageFragment
    }
  }
`;
