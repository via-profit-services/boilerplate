import React, { CSSProperties } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from '@emotion/styled';

import fragmentSpec, { BlockRowFragment$key } from '~/relay/artifacts/BlockRowFragment.graphql';
import BlockRowPlainText from './BlockRowPlainText';
import BlockRowImage from './BlockRowImage';

export interface BlockRowFragmentProps {
  readonly pageFragment: BlockRowFragment$key;
  readonly style: CSSProperties;
  readonly index: number;
  readonly sizesMap: Map<number, number>;
  readonly setRowHeight: (index: number, height: number) => void;
}

const BlockContainer = styled.div`
  padding: 1em 1.2em;
  border-bottom: 1px solid #d3d2d2;
  background-color: ${({ theme }) => theme.colors.background.area};
`;

const PageRow: React.FC<BlockRowFragmentProps> = props => {
  const { pageFragment, index, style, setRowHeight, sizesMap } = props;
  const { contentBlock } = useFragment(fragmentSpec, pageFragment);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (containerRef.current && !sizesMap.has(index)) {
      setRowHeight(index, containerRef.current.getBoundingClientRect().height);
    }
  }, [index, setRowHeight, sizesMap]);

  return (
    <div style={style}>
      <BlockContainer ref={containerRef}>
        <div>
          {contentBlock.__typename !== '%other' && <b>{contentBlock.type}</b>}{' '}
          {contentBlock.__typename !== '%other' && <i>{contentBlock.name}</i>}
        </div>
        {contentBlock.__typename === 'ContentBlockPlainText' && (
          <BlockRowPlainText fragmentRef={contentBlock} />
        )}
        {contentBlock.__typename === 'ContentBlockImage' && (
          <BlockRowImage fragmentRef={contentBlock} />
        )}
        {contentBlock.__typename === 'ContentBlockLexical' && <>ContentBlockLexical</>}
      </BlockContainer>
    </div>
  );
};

export default PageRow;

graphql`
  fragment BlockRowFragment on Block {
    id
    contentBlock {
      __typename
      ... on ContentBlockPlainText {
        ...BlockRowPlainTextFragment
        type
        name
      }
      ... on ContentBlockLexical {
        type
        name
      }
      ... on ContentBlockImage {
        ...BlockRowImageFragment
        type
        name
      }
    }
  }
`;
