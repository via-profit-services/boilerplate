import { GraphQLNonNull, GraphQLObjectType } from 'graphql';

import Page from '~/schema/types/Page';

const PageMutationSuccess = new GraphQLObjectType({
  name: 'PageMutationSuccess',
  fields: () => ({
    page: {
      type: new GraphQLNonNull(Page),
    },
  }),
});

export default PageMutationSuccess;
