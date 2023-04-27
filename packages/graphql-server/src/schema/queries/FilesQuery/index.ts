import { GraphQLObjectType } from 'graphql';

import file from './file';

const FilesQuery = new GraphQLObjectType({
  name: 'FilesQuery',
  fields: () => ({
    file,
  }),
});

export default FilesQuery;
