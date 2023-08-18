import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import UserEdge from '~/schema/connections/UserEdge';

const UsersConnection = new GraphQLObjectType({
  name: 'UsersConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserEdge))) },
  }),
});

export default UsersConnection;
