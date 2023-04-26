import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { OrderDirectionType } from '@via-profit-services/core';

import BlogPostOrderField from '~/schema/enums/BlogPostOrderField';

const BlogPostOrderBy = new GraphQLInputObjectType({
  name: 'BlogPostOrderBy',
  fields: {
    field: { type: new GraphQLNonNull(BlogPostOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  },
});

export default BlogPostOrderBy;
