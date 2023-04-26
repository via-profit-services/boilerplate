import { GraphQLUnionType } from 'graphql';

import ContentBlockMutationSuccess from '~/schema/types/ContentBlockMutationSuccess';
import ContentBlockMutationError from '~/schema/types/ContentBlockMutationError';

const ContentBlockMutationPayload = new GraphQLUnionType({
  name: 'ContentBlockMutationPayload',
  types: () => [ContentBlockMutationSuccess, ContentBlockMutationError],
});

export default ContentBlockMutationPayload;
