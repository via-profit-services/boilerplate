import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import BlockEdge from '~/schema/connections/BlockEdge';

const BlocksConnection = new GraphQLObjectType({
  name: 'BlocksConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(BlockEdge))) },
  }),
});

export default BlocksConnection;
