import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import ClientEdge from '~/schema/connections/ClientEdge';

const ClientsConnection = new GraphQLObjectType({
  name: 'ClientsConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ClientEdge))) },
  }),
});

export default ClientsConnection;
