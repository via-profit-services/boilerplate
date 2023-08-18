import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import FunnelEdge from '~/schema/connections/FunnelEdge';

const FunnelsConnection = new GraphQLObjectType({
  name: 'FunnelsConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(FunnelEdge))) },
  }),
});

export default FunnelsConnection;
