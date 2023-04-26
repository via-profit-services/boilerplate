import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import { ErrorInterfaceType } from '@via-profit-services/core';

const TokenVerificationError = new GraphQLObjectType({
  name: 'TokenVerificationError',
  interfaces: [ErrorInterfaceType],
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    msg: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export default TokenVerificationError;
