import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '@via-profit-services/core';

import { PageMeta as Parent } from 'webpages';

import Page from '~/schema/types/Page';

const PageMeta = new GraphQLObjectType<Parent, Context>({
  name: 'PageMeta',
  description: 'Web page meta data',
  fields: () => {
    const fields: Record<keyof Parent | 'id', GraphQLFieldConfig<Parent, Context>> = {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: parent => `${parent.page}:meta`,
      },
      locale: {
        description: 'Web page locale and the HTML attribute <html lang="...">',
        type: new GraphQLNonNull(GraphQLString),
        resolve: parent => parent.locale || '',
      },
      title: {
        description: 'Meta tag <title>...</title>',
        type: GraphQLString,
        resolve: parent => parent.title,
      },
      description: {
        description: 'Meta tag <meta name="description" content="...">',
        type: GraphQLString,
        resolve: parent => parent.description,
      },
      keywords: {
        description: 'Meta tag <meta name="keywords" content="...">',
        deprecationReason:
          'Google and other search engines no longer consider the keywords meta tag',
        type: GraphQLString,
        resolve: parent => parent.keywords,
      },
      page: {
        type: new GraphQLNonNull(Page),
        resolve: async (parent, _args, context) => {
          const { page } = parent;
          const { dataloader } = context;

          return await dataloader.webpages.load(page);
        },
      },
    };

    return fields;
  },
});

export default PageMeta;
