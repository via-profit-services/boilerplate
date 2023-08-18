import { GraphQLEnumType } from 'graphql';

const BlogPostOrderField = new GraphQLEnumType({
  name: 'BlogPostOrderField',
  values: {
    PUBLISHED_AT: { value: 'publishedAt' },
  },
});

export default BlogPostOrderField;
