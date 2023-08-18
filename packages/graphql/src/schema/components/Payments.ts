import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } from 'graphql';

import ContentBlockPlainText from '~/schema/types/ContentBlockPlainText';
import ContentBlockLexical from '~/schema/types/ContentBlockLexical';
import { TemplateParent } from 'webpages';

const PaymentIcon = new GraphQLObjectType({
  name: 'PaymentIcon',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    color: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const Payments = new GraphQLObjectType<TemplateParent>({
  name: 'Payments',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: parent => `fakeID:payments${parent.page}:${parent.id}`,
    },
    icons: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PaymentIcon))),
      resolve: () => {
        const icons = [
          {
            id: '3edb3d79-060e-48ad-9443-3c68839f5a7f',
            color: '#ff9797',
          },
          {
            id: 'ce6fcc0b-a53b-465c-8dce-df97b09b37b3',
            color: '#ff97de',
          },
          {
            id: '03809aab-c7c4-494c-9000-1f9f80be38af',
            color: '#c297ff',
          },
          {
            id: '407e1349-8a63-4d8c-b4ba-42cd287dcac4',
            color: '#97b4ff',
          },
          {
            id: 'd1e83bff-0044-4184-bd33-b0fdefd23d29',
            color: '#97fdff',
          },
        ];

        return icons;
      },
    },
    title: {
      type: ContentBlockPlainText,
      resolve: async parent => parent.contentBlocks.find(cb => cb.name === 'payments:heading'),
    },
    subtitle: {
      type: ContentBlockPlainText,
      resolve: async parent => parent.contentBlocks.find(cb => cb.name === 'payments:subheading'),
    },
    content: {
      type: ContentBlockLexical,
      resolve: async parent => parent.contentBlocks.find(cb => cb.name === 'payments:content'),
    },
  }),
});

export default Payments;
