import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { EdgeInterfaceType } from '@via-profit-services/core';

import User from '~/schema/types/User';

const UserEdge = new GraphQLObjectType({
  name: 'UserEdge',
  interfaces: [EdgeInterfaceType],
  fields: () => ({
    cursor: { type: new GraphQLNonNull(GraphQLString) },
    node: { type: new GraphQLNonNull(User) },
  }),
});

export default UserEdge;
