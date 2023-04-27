import React from 'react';
import { PreloadedQuery, usePreloadedQuery, graphql, usePaginationFragment } from 'react-relay';
import { VariableSizeList, ListOnScrollProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import BlockRow from './BlockRow';
import fragmentSpec, {
  PagesListBlocksDisplayFragment$key,
} from '~/relay/artifacts/PagesListBlocksDisplayFragment.graphql';
import querySpec, { PagesListBlocksQuery } from '~/relay/artifacts/PagesListBlocksQuery.graphql';
import ContentArea from '~/components/ContentArea';

interface Props {
  readonly preloadedQuery: PreloadedQuery<PagesListBlocksQuery>;
}

const Container = styled(ContentArea)`
  height: 100%;
  flex: 1;
`;

const PagesListBlocksDisplay: React.FC<Props> = props => {
  const { preloadedQuery } = props;
  // const navigate = useNavigate();
  // const { location } = useNavigation();
  const listRef = React.useRef<VariableSizeList | null>(null);
  const listOuterRef = React.useRef<HTMLDivElement | null>(null);
  const sizeMapRef = React.useRef(new Map<number, number>());
  const getRowHeight = React.useCallback(
    (index: number) => sizeMapRef.current.get(index) || 138,
    [],
  );
  const setRowHeight = React.useCallback((index: number, height: number) => {
    sizeMapRef.current.set(index, height);
    listRef.current?.resetAfterIndex(index);
  }, []);
  const fragment = usePreloadedQuery(querySpec, preloadedQuery);
  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment<
    PagesListBlocksQuery,
    PagesListBlocksDisplayFragment$key
  >(fragmentSpec, fragment);
  const {
    pages: {
      blocks: {
        edges,
        pageInfo: { startCursor },
      },
    },
  } = data;

  const onScroll = React.useCallback(
    ({ scrollOffset, scrollDirection }: ListOnScrollProps) => {
      if (listOuterRef.current && scrollDirection === 'forward') {
        const offset = listOuterRef.current.scrollHeight - listOuterRef.current.clientHeight;
        if (scrollOffset >= offset - 200 && hasNext && !isLoadingNext) {
          loadNext(40);
        }
      }
    },
    [loadNext, hasNext, isLoadingNext],
  );

  // React.useEffect(() => {
  //   if (startCursorRef.current !== startCursor) {
  //     startCursorRef.current = startCursor;

  //     if (startCursor) {
  //       const parsedCursor = JSON.parse(window.atob(startCursor));
  //       const navigationCursor = window.btoa(
  //         JSON.stringify({ ...parsedCursor, offset: parsedCursor.offset - 1 }),
  //       );
  //       navigate(`/pages/list/${navigationCursor}`);
  //     }

  //     if (!startCursor) {
  //       navigate('/pages/list');
  //     }
  //   }
  // }, [startCursor, navigate, location]);

  return (
    <Container>
      <AutoSizer>
        {({ width, height }) => (
          <VariableSizeList
            ref={listRef}
            outerRef={listOuterRef}
            width={width || '100%'}
            height={height || '100%'}
            onScroll={onScroll}
            itemSize={getRowHeight}
            itemCount={edges.length}
            estimatedItemSize={30}
          >
            {({ index, style }) => {
              const edge = edges[index];

              return (
                <BlockRow
                  setRowHeight={setRowHeight}
                  sizesMap={sizeMapRef.current}
                  style={style}
                  index={index}
                  pageFragment={edge.node}
                />
              );
            }}
          </VariableSizeList>
        )}
      </AutoSizer>
    </Container>
  );
};

export default PagesListBlocksDisplay;

graphql`
  fragment PagesListBlocksDisplayFragment on Query
  @refetchable(queryName: "PagesListBlocksDisplayPaginationQuery") {
    pages {
      blocks(
        first: $first
        last: $last
        after: $after
        before: $before
        orderBy: $orderBy
        id: $id
        name: $name
        type: $type
        page: $page
      )
        @connection(
          key: "PagesListBlocksQuery_blocks"
          filters: ["orderBy", "id", "name", "type", "page"]
        ) {
        pageInfo {
          startCursor
        }
        edges {
          node {
            id
            ...BlockRowFragment
          }
        }
      }
    }
  }
`;
