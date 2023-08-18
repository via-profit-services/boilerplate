import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from 'graphql';
import { Context } from '@via-profit-services/core';

import User from '~/schema/types/User';

type Args = {
  id: string;
};

const user: GraphQLFieldConfig<unknown, Context, Args> = {
  type: User,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_parent, args, context) => {
    const { id } = args;
    const { dataloader } = context;

    return await dataloader.users.load(id);
  },
};

export default user;
