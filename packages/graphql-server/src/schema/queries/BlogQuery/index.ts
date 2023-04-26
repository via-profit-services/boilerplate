import { GraphQLObjectType } from 'graphql';

import posts from '~/schema/queries/BlogQuery/posts';

const BlogQuery = new GraphQLObjectType({
  name: 'BlogQuery',
  fields: () => ({
    posts,
  }),
});

export default BlogQuery;
