import React from 'react';
import styled from '@emotion/styled';
import { graphql, useFragment } from 'react-relay';

import Image from '@via-profit/ui-kit/Image';
import fragmentSpec, { SlideFragment$key } from '~/relay/artifacts/SlideFragment.graphql';

export interface SlideProps {
  readonly fragmentRef: SlideFragment$key;
}

const Container = styled.div`
  height: 620px;
  position: relative;
`;

const InnerImage = styled(Image)`
  position: absolute;
  background-size: cover;
  background-position: center center;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const Slide: React.FC<SlideProps> = props => {
  const { fragmentRef } = props;
  const { image } = useFragment(fragmentSpec, fragmentRef);

  if (image?.__typename !== 'ContentBlockImage') {
    return null;
  }

  const { file } = image;

  return (
    <Container>
      <InnerImage src={file.image?.url || ''} thumb={file.thumb?.url || ''} />
    </Container>
  );
};

export default Slide;

graphql`
  fragment SlideFragment on Slide {
    id
    image {
      __typename
      id
      alt
      title
      file {
        url
        image: transform(
          input: [{ cover: { w: 1102, h: 620 } }, { format: { type: WEBP, quality: 80 } }]
        ) {
          url
        }
        thumb: transform(
          input: [
            { cover: { w: 142, h: 80 } }
            { format: { type: WEBP, quality: 25 } }
            { blur: 12 }
          ]
        ) {
          url
        }
      }
    }
  }
`;
