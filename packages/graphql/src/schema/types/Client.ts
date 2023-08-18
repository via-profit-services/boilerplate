import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLFieldConfig,
} from 'graphql';
import { Context, DateTimeScalarType, NodeInterfaceType } from '@via-profit-services/core';

import { Client as Parent } from 'clients';
import ClientStatus from '~/schema/enums/ClientStatus';
import ClientLegalStatus from '~/schema/enums/ClientLegalStatus';
import Person from '~/schema/types/Person';

const Client = new GraphQLObjectType<Parent, Context>({
  name: 'Client',
  interfaces: () => [NodeInterfaceType],
  fields: () => {
    const fields: Record<keyof Parent, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      comment: { type: GraphQLString },
      status: { type: new GraphQLNonNull(ClientStatus) },
      legalStatus: { type: new GraphQLNonNull(ClientLegalStatus) },
      persons: {
        type: new GraphQLList(new GraphQLNonNull(Person)),
        resolve: async (parent, _args, context) => {
          const { persons } = parent;
          const { dataloader } = context;

          const personsList = await Promise.all(persons.map(id => dataloader.persons.load(id)));

          return personsList.every(person => person === null) ? null : personsList;
        },
      },
    };

    return fields;
  },
});

export default Client;
