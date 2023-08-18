import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from 'graphql';
import { Context } from '@via-profit-services/core';

import Client from '~/schema/types/Client';

type Args = {
  readonly id: string;
};

const client: GraphQLFieldConfig<unknown, Context, Args> = {
  type: Client,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_parent, args, context) => {
    const { dataloader, emitter } = context;
    const { id } = args;

    try {
      return await dataloader.clients.load(id);
    } catch (err) {
      emitter.emit(
        'log-error',
        'clients',
        err instanceof Error ? `Failed to load client data: ${err.message}` : 'Unknown Error',
      );

      return null;
    }
  },
};

export default client;
