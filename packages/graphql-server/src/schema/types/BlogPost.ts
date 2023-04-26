import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfig,
} from 'graphql';
import { NodeInterfaceType, DateTimeScalarType, Context } from '@via-profit-services/core';

import Page from '~/schema/types/Page';
import type { BlogPostParent } from 'blog';

const BlogPost = new GraphQLObjectType<BlogPostParent, Context>({
  name: 'BlogPost',
  interfaces: () => [NodeInterfaceType],
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<BlogPostParent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      publishedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      page: {
        type: Page,
        resolve: async (parent, _args, context) => {
          const { page: pageID } = parent;
          const { dataloader } = context;

          return await dataloader.webpages.load(pageID);
        },
      },
    };

    return fields;
  },
});

export default BlogPost;
