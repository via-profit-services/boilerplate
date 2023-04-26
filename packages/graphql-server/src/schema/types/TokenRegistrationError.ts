import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { ErrorInterfaceType } from '@via-profit-services/core';

const TokenRegistrationError = new GraphQLObjectType({
  name: 'TokenRegistrationError',
  interfaces: () => [ErrorInterfaceType],
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    msg: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default TokenRegistrationError;
