import { GraphQLEnumType } from 'graphql';

const FilesOrderField = new GraphQLEnumType({
  name: 'FilesOrderField',
  values: {
    category: { value: 'category' },
    mimeType: { value: 'mimeType' },
    createdAt: { value: 'createdAt' },
    updatedAt: { value: 'updatedAt' },
  },
});

export default FilesOrderField;
