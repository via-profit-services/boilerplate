import React from 'react';
import { graphql, useFragment } from 'react-relay';

import fragmentSpec, {
  TemplateFallbackContent$key,
} from '~/relay/artifacts/TemplateFallbackContent.graphql';
import ContentBlockLexical from '~/components/ContentBlock/ContentBlockLexical';

interface TemplateFallbackContentProps {
  readonly fragmentRef: TemplateFallbackContent$key | null;
}

const TemplateFallbackContent: React.FC<TemplateFallbackContentProps> = props => {
  const { fragmentRef } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);

  if (!fragment || !fragment.content) {
    return null;
  }

  return <ContentBlockLexical fragmentRef={fragment.content} />;
};

export default TemplateFallbackContent;

graphql`
  fragment TemplateFallbackContent on TemplateFallbackPage {
    content {
      __typename
      ...ContentBlockLexicalFragment
    }
  }
`;
