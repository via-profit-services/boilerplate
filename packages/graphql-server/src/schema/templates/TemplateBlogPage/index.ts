import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { Context } from '@via-profit-services/core';

import { TemplateParent } from 'webpages';
import PageTemplateInterface from '~/schema/interfaces/PageTemplateInterface';
import Page from '~/schema/types/Page';
import TemplateName from '~/schema/enums/TemplateName';
import ContentBlockPlainText from '~/schema/types/ContentBlockPlainText';
import BlogPostsConnection from '~/schema/connections/BlogPostsConnection';
import BlogPostOrderBy from '~/schema/inputs/BlogPostOrderBy';

const TemplateBlogPage = new GraphQLObjectType<TemplateParent, Context>({
  name: 'TemplateBlogPage',
  interfaces: [PageTemplateInterface],
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: async parent => `fakeID:${parent.page}:${parent.id}`,
    },
    name: { type: new GraphQLNonNull(TemplateName) },
    displayName: { type: new GraphQLNonNull(GraphQLString) },
    page: {
      type: new GraphQLNonNull(Page),
      resolve: async (parent, _args, context) => {
        const { page: pageID } = parent;
        const { dataloader } = context;
        const page = await dataloader.webpages.load(pageID);

        return page;
      },
    },
    heading: {
      type: ContentBlockPlainText,
      description: 'H1 heading',
      resolve: parent => parent.contentBlocks.find(cb => cb.name === 'blog:heading'),
    },
    posts: {
      type: new GraphQLNonNull(BlogPostsConnection),
      args: {
        first: { type: GraphQLInt },
        last: { type: GraphQLInt },
        after: { type: GraphQLString },
        before: { type: GraphQLString },
        orderBy: { type: new GraphQLList(new GraphQLNonNull(BlogPostOrderBy)) },
      },
      resolve: async (_parent, args, context) => {
        const { services } = context;
        const { first, last, before } = args;

        if (!first && !last) {
          throw new Error(
            'Missing «first» or «last» argument. You must provide one of the argument',
          );
        }

        if (first && last) {
          throw new Error('Got «first» and «last» arguments. You must provide one of the argument');
        }

        if (last && !before) {
          throw new Error('Missing «before» argument. You must provide cursor value');
        }

        if (typeof first === 'number' && first < 0) {
          throw new Error('Argument «first» must be a positive integer value');
        }

        if (typeof last === 'number' && last < 0) {
          throw new Error('Argument «last» must be a positive integer value');
        }

        return await services.blog.getPostsConnection(args);
      },
    },
  }),
});

export default TemplateBlogPage;
