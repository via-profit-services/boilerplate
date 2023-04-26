import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from 'graphql';
import { Context } from '@via-profit-services/core';

import Client from '~/schema/types/Client';

type Args = {
  id: string;
};

const client: GraphQLFieldConfig<unknown, Context, Args> = {
  type: Client,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_parent, args, context) => {
    const { dataloader } = context;
    const { id } = args;

    return await dataloader.clients.load(id);
  },
};

export default client;
