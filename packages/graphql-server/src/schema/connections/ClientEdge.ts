import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { EdgeInterfaceType } from '@via-profit-services/core';

import Client from '~/schema/types/Client';

const ClientEdge = new GraphQLObjectType({
  name: 'ClientEdge',
  interfaces: [EdgeInterfaceType],
  fields: () => ({
    cursor: { type: new GraphQLNonNull(GraphQLString) },
    node: { type: new GraphQLNonNull(Client) },
  }),
});

export default ClientEdge;
