import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { EdgeInterfaceType } from '@via-profit-services/core';

import BlogPost from '~/schema/types/BlogPost';

const BlogPostEdge = new GraphQLObjectType({
  name: 'BlogPostEdge',
  interfaces: [EdgeInterfaceType],
  fields: () => ({
    cursor: { type: new GraphQLNonNull(GraphQLString) },
    node: { type: new GraphQLNonNull(BlogPost) },
  }),
});

export default BlogPostEdge;
