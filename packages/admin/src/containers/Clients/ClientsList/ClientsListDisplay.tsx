import * as React from 'react';
import { PreloadedQuery, usePreloadedQuery, usePaginationFragment } from 'react-relay';
import { VariableSizeList, ListOnScrollProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { useContext, actionSetListOuterRef } from './useContext';
import ClientsListRow from '~/containers/Clients/ClientsList/ClientsListRow';
import query, { ClientsListQuery } from '~/relay/artifacts/ClientsListQuery.graphql';
import fragment, { ClientsList_clients$key } from '~/relay/artifacts/ClientsList_clients.graphql';

// const selector = createStructuredSelector({
//   variables: (store: ReduxStore) => store.variables,
// });

interface Props {
  readonly preloadedQuery: PreloadedQuery<ClientsListQuery>;
}

const ClientsListDisplay: React.FC<Props> = props => {
  const { preloadedQuery } = props;
  const { dispatch, state } = useContext();
  const { variables } = state;
  const variablesRef = React.useRef(variables);
  const listRef = React.useRef<VariableSizeList | null>(null);
  const listInnerRef = React.useRef<HTMLDivElement | null>(null);
  const listOuterRef = React.useRef<HTMLDivElement | null>(null);
  const defaultItemHeightRef = React.useRef(60);
  const paginationFragmentRef = usePreloadedQuery<ClientsListQuery>(query, preloadedQuery);
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    ClientsListQuery,
    ClientsList_clients$key
  >(fragment, paginationFragmentRef);
  const { edges } = data.clients.list;

  React.useEffect(() => {
    if (JSON.stringify(variables) !== JSON.stringify(variablesRef.current)) {
      variablesRef.current = variables;
      listRef?.current?.scrollTo(0);
      refetch(variables);
    }
  }, [variables, refetch]);
  // useSubscription<ClientsListSubscription>(
  //   React.useMemo(
  //     () => ({
  //       subscription,
  //       variables: {},
  //     }),
  //     [],
  //   ),
  // );

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
      if (listOuterRef.current && scrollDirection === 'forward') {
        const offset = listOuterRef.current.scrollHeight - listOuterRef.current.clientHeight;
        if (scrollOffset >= offset - 300 && hasNext && !isLoadingNext) {
          loadNext(variables.first || 30);
        }
      }
    },
    [loadNext, hasNext, isLoadingNext, variables.first],
  );

  return (
    <AutoSizer>
      {({ width, height }) => (
        <VariableSizeList
          ref={listRef}
          innerRef={listInnerRef}
          outerRef={ref => {
            listOuterRef.current = ref;
            dispatch(actionSetListOuterRef(ref));
          }}
          itemCount={edges.length}
          width={width || '100%'}
          height={height || '100%'}
          itemSize={index => sizeMapRef.current.get(index) || defaultItemHeightRef.current}
          estimatedItemSize={defaultItemHeightRef.current}
          onScroll={onScroll}
        >
          {({ index, style }) => (
            <ClientsListRow
              style={style}
              setRowHeight={setRowHeight}
              clientFragmentRef={edges[index].node}
              index={index}
            />
          )}
        </VariableSizeList>
      )}
    </AutoSizer>
  );
};

export default ClientsListDisplay;
