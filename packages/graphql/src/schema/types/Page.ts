import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFieldConfig,
  GraphQLList,
} from 'graphql';
import { NodeInterfaceType, DateTimeScalarType, Context } from '@via-profit-services/core';

import type { ContentBlock as ContentBlockType, PageParent, TemplateParent } from 'webpages';
import PageMeta from '~/schema/types/PageMeta';
import PageTemplate from '~/schema/types/PageTemplate';
import ContentBlock from '~/schema/unions/ContentBlock';

const Page = new GraphQLObjectType<PageParent, Context>({
  name: 'Page',
  interfaces: () => [NodeInterfaceType],
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<PageParent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      template: {
        type: PageTemplate,
        resolve: async (parent, _args, context) => {
          const { template: templateID, id, contentBlocks: pageBlocks } = parent;
          const { dataloader } = context;

          if (typeof templateID !== 'string') {
            return null;
          }

          const template = await dataloader.templates.load(templateID);

          const contentBlocks = await dataloader.contentBlocks
            .loadMany(pageBlocks)
            .then(list => list.filter((cb): cb is ContentBlockType => !(cb instanceof Error)));

          const resolverPayload: TemplateParent = {
            ...template,
            __typename: template.name,
            page: id,
            contentBlocks,
          };

          return resolverPayload;
        },
      },
      contentBlocks: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ContentBlock))),
        resolve: async (parent, _args, context) => {
          const { contentBlocks } = parent;
          const { dataloader } = context;

          const cbRecords = await dataloader.contentBlocks
            .loadMany(contentBlocks)
            .then(list =>
              list.filter((cb): cb is ContentBlockType => !(cb instanceof Error) && cb !== null),
            );

          return cbRecords;
        },
      },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      path: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Page address. Not to be confused with the URL',
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The page name is not shown anywhere except the admin panel',
      },
      order: { type: new GraphQLNonNull(GraphQLInt) },
      meta: { type: new GraphQLNonNull(PageMeta) },
      statusCode: { type: new GraphQLNonNull(GraphQLInt) },
      parent: {
        type: Page,
        resolve: async (parent, _args, context) => {
          const { pid } = parent;
          const { dataloader } = context;
          if (!pid) {
            return null;
          }

          return await dataloader.webpages.load(pid);
        },
      },

      childs: {
        type: new GraphQLList(new GraphQLNonNull(Page)),
        resolve: async (parent, _args, context) => {
          const { childs } = parent;
          const { dataloader } = context;

          if (!childs) {
            return null;
          }

          const childsList = await dataloader.webpages.loadMany(childs);

          childsList.sort((a, b) => {
            if (a instanceof Error || b instanceof Error) {
              return 0;
            }

            if (a.order < b.order) {
              return -1;
            }

            if (a.order > b.order) {
              return 1;
            }

            return 0;
          });

          return childsList;
        },
      },
    };

    return fields;
  },
});

export default Page;
