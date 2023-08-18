import React from 'react';
import { graphql, useFragment } from 'react-relay';

import fragmentSpec, {
  BlockRowImageFragment$key,
} from '~/relay/artifacts/BlockRowImageFragment.graphql';

export interface BlockRowImageProps {
  readonly fragmentRef: BlockRowImageFragment$key;
}

const BlockRowImage: React.FC<BlockRowImageProps> = props => {
  const { fragmentRef } = props;
  const { file } = useFragment(fragmentSpec, fragmentRef);

  return <img src={file.thumb?.url} width="64" height="64" />;
};

export default BlockRowImage;

graphql`
  fragment BlockRowImageFragment on ContentBlockImage {
    id
    file {
      thumb: transform(input: [{ contain: { w: 64, h: 64 } }]) {
        id
        url
      }
    }
  }
`;
