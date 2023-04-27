import React from 'react';
import styled from '@emotion/styled';
import { graphql, useQueryLoader } from 'react-relay';
import { useParams } from 'react-router-dom';

import querySpec, { PagesListBlocksQuery } from '~/relay/artifacts/PagesListBlocksQuery.graphql';
import LoadingIndicator from '~/components/LoadingIndicator';
import PagesListBlocksDisplay from './PagesListBlocksDisplay';

const Container = styled.div`
  flex: 1;
  display: flex;
  height: calc(100vh - 3rem);
  flex-flow: column;
`;

const PagesListBlocks: React.FC = () => {
  const [preloadedQuery, loadQuery] = useQueryLoader<PagesListBlocksQuery>(querySpec);
  const { id } = useParams<{ id?: string }>();

  React.useEffect(() => {
    if (!preloadedQuery) {
      loadQuery({
        first: 30,
        page: id ? [id] : null,
        orderBy: [{ field: 'TYPE', direction: 'ASC' }],
      });
    }
  }, [preloadedQuery, loadQuery, id]);

  return (
    <Container>
      <React.Suspense fallback={<LoadingIndicator />}>
        {preloadedQuery && <PagesListBlocksDisplay preloadedQuery={preloadedQuery} />}
      </React.Suspense>
    </Container>
  );
};

export default PagesListBlocks;

graphql`
  query PagesListBlocksQuery(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $orderBy: [BlocksOrderBy!]
    $name: [String!]
    $type: [ContentBlockType!]
    $page: [ID!]
    $id: [ID!]
  ) {
    ...PagesListBlocksDisplayFragment
  }
`;
