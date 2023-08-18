import { GraphQLEnumType } from 'graphql';

const ContentBlockType = new GraphQLEnumType({
  name: 'ContentBlockType',
  values: {
    IMAGE: { value: 'IMAGE' },
    PLAIN_TEXT: { value: 'PLAIN_TEXT' },
    FORMATTED_TEXT: { value: 'FORMATTED_TEXT' },
  },
});

export default ContentBlockType;
