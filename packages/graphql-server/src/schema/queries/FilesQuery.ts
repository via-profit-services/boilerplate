import { GraphQLObjectType, GraphQLNonNull, GraphQLID } from 'graphql';

import File from '~/schema/types/File';

interface Args {
  readonly id: string;
}

const FilesQuery = new GraphQLObjectType({
  name: 'FilesQuery',
  fields: () => ({
    file: {
      type: File,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_parent, args: Args, context) => {
        const { dataloader } = context;
        const { id } = args;

        const file = await dataloader.files.load(id);

        return file;
      },
    },
  }),
});

export default FilesQuery;
