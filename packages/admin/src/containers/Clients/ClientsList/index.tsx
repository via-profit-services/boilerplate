import * as React from 'react';
import { graphql, useQueryLoader } from 'react-relay';
import styled from '@emotion/styled';

import usePreset from '../utils/usePreset';
import { ContextProvider } from './useContext';
import query, { ClientsListQuery } from '~/relay/artifacts/ClientsListQuery.graphql';
import ClientsListDisplay from './ClientsListDisplay';
import LoadingIndicator from '~/components/LoadingIndicator';
import ClientsListForms from './ClientsListForms';
import ClientsListSidebar from './ClientsListSidebar';
import ClientsListBottombar from './ClientsListBottombar';

const ClientsListContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const ClientsListCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ClientListCenterWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ClientListDisplayWrapper = styled.div`
  flex: 1;
`;

const ClientsList: React.FC = () => {
  const { variables, presetName } = usePreset();
  const [preloadedQuery, loadQuery, disposeQuery] = useQueryLoader<ClientsListQuery>(query);
  const presetNameRef = React.useRef(presetName);

  React.useEffect(() => {
    if (preloadedQuery && presetNameRef.current !== presetName) {
      presetNameRef.current = presetName;
      disposeQuery();
    }

    if (!preloadedQuery) {
      loadQuery(variables);
    }
  }, [preloadedQuery, loadQuery, disposeQuery, variables, presetName]);

  return (
    <ContextProvider>
      <ClientsListContainer>
        <ClientsListCenter>
          <ClientListCenterWrapper>
            <ClientListDisplayWrapper>
              <React.Suspense fallback={<LoadingIndicator />}>
                {preloadedQuery && <ClientsListDisplay preloadedQuery={preloadedQuery} />}
              </React.Suspense>
            </ClientListDisplayWrapper>
            <ClientsListBottombar />
          </ClientListCenterWrapper>
          <ClientsListSidebar />
        </ClientsListCenter>
      </ClientsListContainer>
      <ClientsListForms />
    </ContextProvider>
  );
};

export default ClientsList;

graphql`
  query ClientsListQuery(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $orderBy: [ClientsOrderBy!]
    $search: [ClientsFilterSearch!]
    $status: [ClientStatus!]
    $legalStatus: [ClientLegalStatus!]
  ) {
    ...ClientsList_clients
  }
`;

graphql`
  fragment ClientsList_clients on Query @refetchable(queryName: "ClientsListPaginationQuery") {
    clients {
      list(
        first: $first
        last: $last
        after: $after
        before: $before
        orderBy: $orderBy
        search: $search
        status: $status
        legalStatus: $legalStatus
      )
        @connection(
          key: "ClientsList_list"
          filters: ["orderBy", "search", "status", "legalStatus"]
        ) {
        pageInfo {
          hasPreviousPage
          hasNextPage
        }
        edges {
          cursor
          node {
            ...ClientsListRowFragment
          }
        }
      }
    }
  }
`;

// graphql`
//   subscription ClientsListSubscription {
//     clientWasUpdated {
//       ...ClientsListRowFragment
//     }
//   }
// `;
