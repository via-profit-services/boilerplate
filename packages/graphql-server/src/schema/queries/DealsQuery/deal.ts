import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from 'graphql';
import { Context } from '@via-profit-services/core';

import Deal from '~/schema/types/Deal';

type Args = {
  id: string;
};

const deal: GraphQLFieldConfig<unknown, Context, Args> = {
  type: Deal,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_parent, args, context) => {
    const { dataloader } = context;
    const { id } = args;

    return await dataloader.deals.load(id);
  },
};

export default deal;
