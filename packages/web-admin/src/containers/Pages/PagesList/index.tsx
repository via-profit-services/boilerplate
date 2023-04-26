import * as React from 'react';
import { graphql, useQueryLoader } from 'react-relay';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import styled from '@emotion/styled';

import PagesListDisplay from './PagesListDisplay';
import querySpec, { PagesListQuery } from '~/relay/artifacts/PagesListQuery.graphql';
import LoadingIndicator from '~/components/LoadingIndicator';
import Toolbar from './Toolbar';

const selector = createSelector(
  (store: ReduxStore) => store.pagesListVariables,
  pagesListVariables => ({ pagesListVariables }),
);

const Container = styled.div`
  flex: 1;
  display: flex;
  height: calc(100vh - 3rem);
  flex-flow: column;
`;
const PagesList: React.FC = () => {
  const { pagesListVariables } = useSelector(selector);
  const [preloadedQuery, loadQuery] = useQueryLoader<PagesListQuery>(querySpec);

  React.useEffect(() => {
    if (!preloadedQuery) {
      loadQuery(pagesListVariables);
    }
  }, [preloadedQuery, loadQuery, pagesListVariables]);

  return (
    <Container>
      <React.Suspense fallback={<LoadingIndicator />}>
        {preloadedQuery && <PagesListDisplay preloadedQuery={preloadedQuery} />}
      </React.Suspense>
      <Toolbar />
    </Container>
  );
};

export default PagesList;

graphql`
  query PagesListQuery(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $search: [PagesSearch!]
    $orderBy: [PageOrderBy!]
    $id: [ID!]
  ) {
    ...PagesListDisplayFragment
  }
`;
