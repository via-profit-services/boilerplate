import { GraphQLEnumType } from 'graphql';

const FilesListSearchField = new GraphQLEnumType({
  name: 'FilesListSearchField',
  values: {
    description: { value: 'description' },
  },
});

export default FilesListSearchField;
