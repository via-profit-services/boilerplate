import * as React from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { useParams } from 'react-router-dom';
import loadable from '@loadable/component';

import query, { PagesEditTemplateQuery } from '~/relay/artifacts/PagesEditTemplateQuery.graphql';
import LoadingIndicator from '~/components/LoadingIndicator';

const EditTemplateHome = loadable(
  () => import('~/containers/Pages/PagesEditTemplate/EditTemplateHome'),
);

const PagesEditTemplate: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { pages } = useLazyLoadQuery<PagesEditTemplateQuery>(query, { id });
  const page = pages.resolve;
  const { template } = page;

  return (
    <>
      <React.Suspense fallback={<LoadingIndicator />}>
        {template && template.__typename === 'TemplateHomePage' && (
          <EditTemplateHome fragmentRef={template} />
        )}
      </React.Suspense>
    </>
  );
};

export default PagesEditTemplate;

graphql`
  query PagesEditTemplateQuery($id: ID) {
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
