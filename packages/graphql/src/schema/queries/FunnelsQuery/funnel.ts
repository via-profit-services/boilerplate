import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from 'graphql';
import { Context } from '@via-profit-services/core';

import Funnel from '~/schema/types/Funnel';

type Args = {
  id: string;
};

const funnel: GraphQLFieldConfig<unknown, Context, Args> = {
  type: Funnel,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_parent, args, context) => {
    const { dataloader } = context;
    const { id } = args;

    return await dataloader.funnels.load(id);
  },
};

export default funnel;
