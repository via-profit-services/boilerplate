import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Context } from '@via-profit-services/core';

import { TemplateParent } from 'webpages';
import PageTemplateInterface from '~/schema/interfaces/PageTemplateInterface';
import Page from '~/schema/types/Page';
import TemplateName from '~/schema/enums/TemplateName';
import ContentBlockPlainText from '~/schema/types/ContentBlockPlainText';
import ContentBlockImage from '~/schema/types/ContentBlockImage';

const TemplateBlogPostPage = new GraphQLObjectType<TemplateParent, Context>({
  name: 'TemplateBlogPostPage',
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
      resolve: parent => parent.contentBlocks.find(cb => cb.name === 'blog:post:heading'),
    },
    image: {
      type: ContentBlockImage,
      description: 'Post image',
      resolve: parent => parent.contentBlocks.find(cb => cb.name === 'blog:post:image'),
    },
  }),
});

export default TemplateBlogPostPage;
