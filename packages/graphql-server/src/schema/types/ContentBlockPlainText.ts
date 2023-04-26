import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLFieldConfig,
} from 'graphql';
import { Context, NodeInterfaceType, DateTimeScalarType } from '@via-profit-services/core';

import type { ContentBlockBase, ContentBlockPlainTextPayload, TemplateParent } from 'webpages';
import ContentBlockInterface from '~/schema/interfaces/ContentBlockInterface';
import ContentBlockType from '~/schema/enums/ContentBlockType';
import Page from '~/schema/types/Page';
import PageTemplate from '~/schema/types/PageTemplate';

type Parent = ContentBlockBase & ContentBlockPlainTextPayload;

export const contentBlockPlainTextFields: Record<
  'page' | 'template',
  GraphQLFieldConfig<ContentBlockBase, Context>
> = {
  page: {
    type: Page,
    resolve: async (parent, _args, context) => {
      const { page: pageID } = parent;
      const { dataloader } = context;

      return await dataloader.webpages.load(pageID);
    },
  },
  template: {
    type: PageTemplate,
    resolve: async (parent, _args, context) => {
      const { template: templateID, page: pageID } = parent;
      const { dataloader } = context;

      const page = await dataloader.webpages.load(pageID);
      const contentBlocks = await dataloader.contentBlocks
        .loadMany(page.contentBlocks)
        .then(list =>
          list
            .filter((cb): cb is Parent => !(cb instanceof Error))
            .filter(cb => cb.template === templateID),
        );

      const template = await dataloader.templates.load(templateID);

      const payload: TemplateParent = {
        __typename: template.name,
        ...template,
        contentBlocks,
        page: pageID,
      };

      return payload;
    },
  },
};

export const ContentBlockPlainText = new GraphQLObjectType({
  name: 'ContentBlockPlainText',
  interfaces: [ContentBlockInterface, NodeInterfaceType],
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      type: { type: new GraphQLNonNull(ContentBlockType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      page: {
        type: Page,
        resolve: contentBlockPlainTextFields.page.resolve,
      },
      template: {
        type: PageTemplate,
        resolve: contentBlockPlainTextFields.template.resolve,
      },
      text: { type: new GraphQLNonNull(GraphQLString) },
    };

    return fields;
  },
});

export default ContentBlockPlainText;
