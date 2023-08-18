import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from 'graphql';
import { Context } from '@via-profit-services/core';

import { ClientsConnectionProps } from 'clients';
import ClientsConnection from '~/schema/connections/ClientsConnection';
import ClientsOrderBy from '~/schema/inputs/ClientsOrderBy';
import ClientStatus from '~/schema/enums/ClientStatus';
import ClientsFilterSearch from '~/schema/inputs/ClientsFilterSearch';
import ClientLegalStatus from '~/schema/enums/ClientLegalStatus';

const list: GraphQLFieldConfig<unknown, Context, ClientsConnectionProps> = {
  type: new GraphQLNonNull(ClientsConnection),
  args: {
    first: { type: GraphQLInt },
    last: { type: GraphQLInt },
    after: { type: GraphQLString },
    before: { type: GraphQLString },
    id: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
    status: { type: new GraphQLList(new GraphQLNonNull(ClientStatus)) },
    legalStatus: { type: new GraphQLList(new GraphQLNonNull(ClientLegalStatus)) },
    orderBy: { type: new GraphQLList(new GraphQLNonNull(ClientsOrderBy)) },
    search: { type: new GraphQLList(new GraphQLNonNull(ClientsFilterSearch)) },
  },
  resolve: async (_parent, args, context) => {
    const { services } = context;
    const { first, last, before } = args;

    if (!first && !last) {
      throw new Error('Missing «first» or «last» argument. You must provide one of the argument');
    }

    if (first && last) {
      throw new Error('Got «first» and «last» arguments. You must provide one of the argument');
    }

    if (last && !before) {
      throw new Error('Missing «before» argument. You must provide cursor value');
    }

    if (typeof first === 'number' && first < 0) {
      throw new Error('Argument «first» must be a positive integer value');
    }

    if (typeof last === 'number' && last < 0) {
      throw new Error('Argument «last» must be a positive integer value');
    }

    return await services.clients.getClientsConnection(args);
  },
};

export default list;
