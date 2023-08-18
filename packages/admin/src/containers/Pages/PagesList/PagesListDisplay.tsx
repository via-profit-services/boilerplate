import React from 'react';
import { PreloadedQuery, usePreloadedQuery, graphql, usePaginationFragment } from 'react-relay';
import { VariableSizeList, ListOnScrollProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { useNavigation } from 'react-router-dom';

import PageRow from './PageRow';
import fragmentSpec, {
  PagesListDisplayFragment$key,
} from '~/relay/artifacts/PagesListDisplayFragment.graphql';
import querySpec, { PagesListQuery } from '~/relay/artifacts/PagesListQuery.graphql';
import ContentArea from '~/components/ContentArea';

interface Props {
  readonly preloadedQuery: PreloadedQuery<PagesListQuery>;
}

const Container = styled(ContentArea)`
  height: 100%;
  flex: 1;
`;

const selector = createSelector(
  (store: ReduxStore) => store.pagesListVariables.first || 10,
  (store: ReduxStore) => store.pagesListVariables,
  (first, pagesListVariables) => ({ first, pagesListVariables }),
);

const PagesListDisplay: React.FC<Props> = props => {
  const { preloadedQuery } = props;
  // const navigate = useNavigate();
  // const { location } = useNavigation();
  const { first, pagesListVariables } = useSelector(selector);
  const listRef = React.useRef<VariableSizeList | null>(null);
  const listOuterRef = React.useRef<HTMLDivElement | null>(null);
  const sizeMapRef = React.useRef(new Map<number, number>());
  const getRowHeight = React.useCallback(
    (index: number) => sizeMapRef.current.get(index) || 138,
    [],
  );
  const pagesListVariablesRef = React.useRef(pagesListVariables);
  const setRowHeight = React.useCallback((index: number, height: number) => {
    sizeMapRef.current.set(index, height);
    listRef.current?.resetAfterIndex(index);
  }, []);
  const fragment = usePreloadedQuery(querySpec, preloadedQuery);
  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment<
    PagesListQuery,
    PagesListDisplayFragment$key
  >(fragmentSpec, fragment);
  const {
    pages: {
      list: {
        edges,
        pageInfo: { startCursor },
      },
    },
  } = data;
  const startCursorRef = React.useRef(startCursor);

  React.useEffect(() => {
    if (JSON.stringify(pagesListVariables) !== JSON.stringify(pagesListVariablesRef.current)) {
      pagesListVariablesRef.current = pagesListVariables;
      sizeMapRef.current.clear();
      refetch(pagesListVariables);
    }
  }, [pagesListVariables, refetch]);

  const onScroll = React.useCallback(
    ({ scrollOffset, scrollDirection }: ListOnScrollProps) => {
      if (listOuterRef.current && scrollDirection === 'forward') {
        const offset = listOuterRef.current.scrollHeight - listOuterRef.current.clientHeight;
        if (scrollOffset >= offset - 200 && hasNext && !isLoadingNext) {
          loadNext(first);
        }
      }
    },
    [loadNext, hasNext, isLoadingNext, first],
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
                <PageRow
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

export default PagesListDisplay;

graphql`
  fragment PagesListDisplayFragment on Query
  @refetchable(queryName: "PagesListDisplayPaginationQuery") {
    pages {
      list(
        first: $first
        last: $last
        after: $after
        before: $before
        search: $search
        orderBy: $orderBy
        id: $id
      ) @connection(key: "PagesListQuery_list", filters: ["search", "orderBy", "id"]) {
        pageInfo {
          startCursor
        }
        edges {
          node {
            id
            ...PageRowFragment
          }
        }
      }
    }
  }
`;
