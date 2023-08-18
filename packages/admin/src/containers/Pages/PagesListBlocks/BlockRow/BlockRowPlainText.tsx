import React from 'react';
import { graphql, useFragment } from 'react-relay';

import fragmentSpec, {
  BlockRowPlainTextFragment$key,
} from '~/relay/artifacts/BlockRowPlainTextFragment.graphql';

export interface BlockRowPlainTextProps {
  readonly fragmentRef: BlockRowPlainTextFragment$key;
}

const BlockRowPlainText: React.FC<BlockRowPlainTextProps> = props => {
  const { fragmentRef } = props;
  const { text } = useFragment(fragmentSpec, fragmentRef);

  return <div>«{text}»</div>;
};

export default BlockRowPlainText;

graphql`
  fragment BlockRowPlainTextFragment on ContentBlockPlainText {
    id
    text
  }
`;
