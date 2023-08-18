import { Context } from '@via-profit-services/core';
import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from 'graphql';

import File from '~/schema/types/File';

interface Args {
  readonly id: string;
}

const file: GraphQLFieldConfig<unknown, Context, Args> = {
  type: File,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_parent, args, context) => {
    const { dataloader } = context;
    const { id } = args;

    return await dataloader.files.load(id);
  },
};

export default file;
