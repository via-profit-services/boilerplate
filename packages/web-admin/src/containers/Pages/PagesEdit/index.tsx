import * as React from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { useParams, Link } from 'react-router-dom';
import loadable from '@loadable/component';

import query, { PagesEditQuery } from '~/relay/artifacts/PagesEditQuery.graphql';
import ContentArea from '~/components/ContentArea';
import LoadingIndicator from '~/components/LoadingIndicator';
import Card from '~/components/Card';

const EditTemplateHome = loadable(() => import('~/containers/Pages/PagesEdit/EditTemplateHome'));

const PagesEdit: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { pages } = useLazyLoadQuery<PagesEditQuery>(query, { id });
  const page = pages.resolve;
  const { name, path, template } = page;

  return (
    <>
      <ContentArea>
        <Card>
          <Link to="/pages/list"> Back</Link>
        </Card>
        <Card>
          <div>Page name: {name}</div>
          <div>ID: {id}</div>
          <div>Path: {path}</div>
          <React.Suspense fallback={<LoadingIndicator />}>
            {template && template.__typename === 'TemplateHomePage' && (
              <EditTemplateHome templateFragment={template} />
            )}
          </React.Suspense>
        </Card>
      </ContentArea>
    </>
  );
};

export default PagesEdit;

graphql`
  query PagesEditQuery($id: ID) {
    pages {
      resolve(id: $id) {
        id
        path
        name
        template {
          __typename
          ... on TemplateHomePage {
            ...EditTemplateHomeFragment
          }
        }
      }
    }
  }
`;
