import * as React from 'react';
import { graphql, useQueryLoader } from 'react-relay';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import Meta from '~/components/Meta';
import UserEditDrawer from '~/components/UserEditDrawer';
import query, { UsersListQuery } from '~/relay/artifacts/UsersListQuery.graphql';
import UsersListDisplay from './UsersListDisplay';
import UsersListFooter from './UsersListFooter';
import LoadingIndicator from '~/components/LoadingIndicator';

graphql`
  query UsersListQuery(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $orderBy: [UserOrderBy!]
    $search: [UsersSearch!]
  ) {
    ...UsersList_users
  }
`;

graphql`
  fragment UsersList_users on Query @refetchable(queryName: "UsersListPaginationQuery") {
    users {
      list(
        first: $first
        last: $last
        after: $after
        before: $before
        orderBy: $orderBy
        search: $search
      ) @connection(key: "UsersList_list", filters: ["orderBy", "search"]) {
        pageInfo {
          hasPreviousPage
          hasNextPage
        }
        edges {
          cursor
          node {
            ...UsersListRowFragment
          }
        }
      }
    }
  }
`;

graphql`
  subscription UsersListSubscription {
    userWasUpdated {
      ...UsersListRowFragment
    }
  }
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  height: calc(100vh - 3rem);
  flex-flow: column;
`;

const selector = createSelector(
  (store: ReduxStore) => store.usersListVariables,
  usersListVariables => ({ usersListVariables }),
);

const UsersList: React.FC = () => {
  const { usersListVariables } = useSelector(selector);
  const [editUserID, setEditUserID] = React.useState<string | null>(null);
  const [preloadedQuery, loadQuery] = useQueryLoader<UsersListQuery>(query);

  React.useEffect(() => {
    if (!preloadedQuery) {
      loadQuery(usersListVariables);
    }
  }, [preloadedQuery, loadQuery, usersListVariables]);

  return (
    <>
      <Meta header="Users list" />
      <Container>
        <React.Suspense fallback={<LoadingIndicator />}>
          {preloadedQuery && (
            <UsersListDisplay preloadedQuery={preloadedQuery} setEditUserID={setEditUserID} />
          )}
        </React.Suspense>

        <UsersListFooter />
      </Container>

      <UserEditDrawer
        id={editUserID}
        onRequestClose={() => setEditUserID(null)}
        onCompleted={() => setEditUserID(null)}
      />
    </>
  );
};

export default UsersList;
