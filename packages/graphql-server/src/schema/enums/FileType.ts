import { GraphQLEnumType } from 'graphql';

const FileType = new GraphQLEnumType({
  name: 'FileType',
  values: {
    AVATAR: { value: 'AVATAR' },
    MEDIA: { value: 'MEDIA' },
    DOCUMENT: { value: 'DOCUMENT' },
  },
});

export default FileType;
