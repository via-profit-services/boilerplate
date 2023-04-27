import * as React from 'react';
import {
  PreloadedQuery,
  usePreloadedQuery,
  usePaginationFragment,
  useSubscription,
} from 'react-relay';
import { VariableSizeList, ListOnScrollProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import UsersListRow from '~/containers/Users/UsersList/UsersListRow';
import query, { UsersListQuery } from '~/relay/artifacts/UsersListQuery.graphql';
import fragment, { UsersList_users$key } from '~/relay/artifacts/UsersList_users.graphql';
import subscription, {
  UsersListSubscription,
} from '~/relay/artifacts/UsersListSubscription.graphql';

const ListContainer = styled.div`
  flex: 1;
`;

const selector = createSelector(
  (store: ReduxStore) => store.usersListVariables,
  usersListVariables => ({ usersListVariables }),
);

interface Props {
  readonly preloadedQuery: PreloadedQuery<UsersListQuery>;
  readonly setEditUserID: (id: string | null) => void;
}

const UsersListDisplay: React.FC<Props> = props => {
  const { preloadedQuery, setEditUserID } = props;
  const { usersListVariables } = useSelector(selector);
  const listRef = React.useRef<VariableSizeList>(null);
  const listInnerRef = React.useRef<HTMLDivElement>(null);
  const listOuterRef = React.useRef<HTMLDivElement>(null);
  const defaultItemHeightRef = React.useRef(83);
  const paginationFragmentRef = usePreloadedQuery<UsersListQuery>(query, preloadedQuery);
  const { data, loadNext, refetch, hasNext, isLoadingNext } = usePaginationFragment<
    UsersListQuery,
    UsersList_users$key
  >(fragment, paginationFragmentRef);
  const { edges } = data.users.list;

  useSubscription<UsersListSubscription>(
    React.useMemo(
      () => ({
        subscription,
        variables: {},
      }),
      [],
    ),
  );

  React.useEffect(() => {
    refetch(usersListVariables);
    listRef.current?.scrollTo(0);
  }, [usersListVariables, refetch]);

  // Cached store for items measure
  const sizeMapRef = React.useRef(new Map<number, number>());
  // Function to save item measures into the sizeMap
  // After calling virtualized list will be rerendered
  const setRowHeight = React.useCallback((index: number, size: number) => {
    sizeMapRef.current.set(index, size);
    listRef.current?.resetAfterIndex(index);
  }, []);

  const onScroll = React.useCallback(
    ({ scrollOffset, scrollDirection }: ListOnScrollProps) => {
      // Detect the end of the reached
      if (listOuterRef.current && scrollDirection === 'forward') {
        // The thresholdPercent is the persont of items from the end of the list in percents value.
        const thresholdPercent = 30;

        // The threshold is the number of items from the end of the list,
        // upon reaching which the additional loading of new items will begin
        const threshold = (10 / 100) * thresholdPercent;
        // const threshold = 10;
        const offset = listOuterRef.current.scrollHeight - listOuterRef.current.clientHeight;
        const lastItemsHeight = Array.from(edges)
          .slice(-threshold)
          .reduce(
            (totalHeight, _edge, index) =>
              totalHeight + (sizeMapRef.current.get(index) || defaultItemHeightRef.current),
            0,
          );
        if (scrollOffset >= offset - lastItemsHeight && hasNext && !isLoadingNext) {
          loadNext(40);
        }
      }
    },
    [edges, loadNext, hasNext, isLoadingNext],
  );

  return (
    <ListContainer>
      <AutoSizer>
        {({ width, height }) => (
          <VariableSizeList
            ref={listRef}
            innerRef={listInnerRef}
            outerRef={listOuterRef}
            itemCount={edges.length}
            width={width || '100%'}
            height={height || '100%'}
            itemSize={index => sizeMapRef.current.get(index) || defaultItemHeightRef.current}
            estimatedItemSize={defaultItemHeightRef.current}
            onScroll={onScroll}
            overscanCount={2}
          >
            {({ index, style }) => (
              <UsersListRow
                style={style}
                setRowHeight={setRowHeight}
                node={edges[index].node}
                index={index}
                onEditUserID={setEditUserID}
              />
            )}
          </VariableSizeList>
        )}
      </AutoSizer>
    </ListContainer>
  );
};

export default UsersListDisplay;
