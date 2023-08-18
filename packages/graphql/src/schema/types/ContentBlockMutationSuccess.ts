import { GraphQLNonNull, GraphQLObjectType } from 'graphql';

import ContentBlock from '~/schema/unions/ContentBlock';

const ContentBlockMutationSuccess = new GraphQLObjectType({
  name: 'ContentBlockMutationSuccess',
  fields: () => ({
    contentBlock: {
      type: new GraphQLNonNull(ContentBlock),
    },
  }),
});

export default ContentBlockMutationSuccess;
