import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Context, DateTimeScalarType, NodeInterfaceType } from '@via-profit-services/core';

import { Person as Parent } from 'clients';
import Client from '~/schema/types/Client';

const Person = new GraphQLObjectType<Parent, Context>({
  name: 'Person',
  interfaces: () => [NodeInterfaceType],
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
    updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    heldPost: { type: new GraphQLNonNull(GraphQLString) },
    comment: { type: GraphQLString },
    client: {
      type: new GraphQLNonNull(Client),
      resolve: async (parent, _args, context) => {
        const { client } = parent;
        const { dataloader } = context;

        return await dataloader.clients.load(client);
      },
    },
  }),
});

export default Person;
