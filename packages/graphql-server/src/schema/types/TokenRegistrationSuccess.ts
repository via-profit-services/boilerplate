import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import Query from '~/schema/queries/Query';
import TokenBag from '~/schema/types/TokenBag';

const TokenRegistrationSuccess = new GraphQLObjectType({
  name: 'TokenRegistrationSuccess',
  fields: () => ({
    payload: { type: new GraphQLNonNull(TokenBag) },
    query: {
      type: new GraphQLNonNull(Query),
      resolve: () => ({}),
    },
  }),
});

export default TokenRegistrationSuccess;
