import { GraphQLUnionType } from 'graphql';

import PageMutationSuccess from '~/schema/types/PageMutationSuccess';
import PageMutationError from '~/schema/types/PageMutationError';

const PageMutationPayload = new GraphQLUnionType({
  name: 'PageMutationPayload',
  types: () => [PageMutationSuccess, PageMutationError],
});

export default PageMutationPayload;
