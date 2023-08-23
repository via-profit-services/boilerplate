import { GraphQLFieldConfig, GraphQLID, GraphQLInt, GraphQLNonNull } from 'graphql';
import type { Context } from '@via-profit-services/core';

type Args = {
  readonly recipient: string;
};

const unreaded: GraphQLFieldConfig<unknown, Context, Args> = {
  description: 'Returns the counter of unread notifications',
  type: new GraphQLNonNull(GraphQLInt),
  args: {
    recipient: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_p, args, context) => {
    const { dataloader } = context;
    const { recipient } = args;

    return await dataloader.notificationsCounter.load(recipient);
  },
};

export default unreaded;
