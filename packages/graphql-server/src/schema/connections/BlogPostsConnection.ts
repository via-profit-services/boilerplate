import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import BlogPostEdge from '~/schema/connections/BlogPostEdge';

const BlogPostConnection = new GraphQLObjectType({
  name: 'BlogPostConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(BlogPostEdge))) },
  }),
});

export default BlogPostConnection;
