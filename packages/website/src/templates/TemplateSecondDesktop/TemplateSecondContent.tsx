import React from 'react';
import { graphql, useFragment } from 'react-relay';

import fragmentSpec, {
  TemplateSecondContent$key,
} from '~/relay/artifacts/TemplateSecondContent.graphql';
import ContentBlockLexical from '~/components/ContentBlock/ContentBlockLexical';

interface TemplateSecondContentProps {
  readonly fragmentRef: TemplateSecondContent$key | null;
}

const TemplateSecondContent: React.FC<TemplateSecondContentProps> = props => {
  const { fragmentRef } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);

  if (!fragment || !fragment.content) {
    return null;
  }

  return <ContentBlockLexical fragmentRef={fragment.content} />;
};

export default TemplateSecondContent;

graphql`
  fragment TemplateSecondContent on TemplateSecondPage {
    content {
      __typename
      ...ContentBlockLexicalFragment
    }
  }
`;
