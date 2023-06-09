import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLString,
} from 'graphql';
import {
  JSONObjectScalarType,
  Context,
  DateTimeScalarType,
  NodeInterfaceType,
} from '@via-profit-services/core';

import type { ContentBlockBase, ContentBlockFormattedPayload } from 'webpages';
import { contentBlockPlainTextFields } from '~/schema/types/ContentBlockPlainText';
import ContentBlockType from '~/schema/enums/ContentBlockType';
import Page from '~/schema/types/Page';
import PageTemplate from '~/schema/types/PageTemplate';
import ContentBlockInterface from '~/schema/interfaces/ContentBlockInterface';

type Parent = ContentBlockBase & ContentBlockFormattedPayload;

const ContentBlockLexical = new GraphQLObjectType({
  name: 'ContentBlockLexical',
  interfaces: () => [ContentBlockInterface, NodeInterfaceType],
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      type: { type: new GraphQLNonNull(ContentBlockType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      page: { type: Page, resolve: contentBlockPlainTextFields.page.resolve },
      template: { type: PageTemplate, resolve: contentBlockPlainTextFields.template.resolve },
      lexical: { type: new GraphQLNonNull(JSONObjectScalarType) },
    };

    return fields;
  },
});

export default ContentBlockLexical;
