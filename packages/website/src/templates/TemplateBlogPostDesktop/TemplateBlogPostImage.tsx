import React from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from '@emotion/styled';

import fragmentSpec, {
  TemplateBlogPostImage$key,
} from '~/relay/artifacts/TemplateBlogPostImage.graphql';
import ContentBlockImage from '~/components/ContentBlock/ContentBlockImage';

interface TemplateBlogPostImageProps {
  readonly fragmentRef: TemplateBlogPostImage$key | null;
}

const Image = styled(ContentBlockImage)`
  width: 30em;
  height: 18em;
  object-fit: cover;
`;

const TemplateBlogPostImage: React.FC<TemplateBlogPostImageProps> = props => {
  const { fragmentRef } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);

  if (!fragment) {
    return null;
  }

  return <Image fragmentRef={fragment.image} />;
};

export default TemplateBlogPostImage;

graphql`
  fragment TemplateBlogPostImage on TemplateBlogPostPage {
    image {
      __typename
      ...ContentBlockImageFragment
    }
  }
`;
