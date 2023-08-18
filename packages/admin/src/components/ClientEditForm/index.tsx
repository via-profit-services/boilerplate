import React from 'react';
import { graphql, useQueryLoader } from 'react-relay';
import LoadingIndicator from '~/components/LoadingIndicator';

import Inner from './Inner';
import querySpec, { ClientEditFormQuery } from '~/relay/artifacts/ClientEditFormQuery.graphql';

export interface ClientEditFormProps {
  readonly id: string;
  readonly isNew: boolean;
}

const ClientEditForm: React.FC<ClientEditFormProps> = props => {
  const { id, isNew } = props;
  const [preloadedQuery, loadQuery] = useQueryLoader<ClientEditFormQuery>(querySpec);

  React.useEffect(() => {
    if (!preloadedQuery && id) {
      loadQuery({ id });
    }
  }, [preloadedQuery, id, loadQuery]);

  return (
    <React.Suspense fallback={<LoadingIndicator />}>
      {preloadedQuery && <Inner id={id} isNew={isNew} preloadedQuery={preloadedQuery} />}
    </React.Suspense>
  );
};

export default ClientEditForm;

graphql`
  fragment ClientEditFormFragment on Client {
    id
    name
  }
`;

graphql`
  query ClientEditFormQuery($id: ID!) {
    clients {
      client(id: $id) {
        ...ClientEditFormFragment @relay(mask: false)
      }
    }
  }
`;
