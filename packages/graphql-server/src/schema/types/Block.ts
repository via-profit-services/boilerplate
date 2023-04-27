import { Context, NodeInterfaceType } from '@via-profit-services/core';
import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import type { ContentBlock as BlockParent } from 'webpages';
import ContentBlock from '~/schema/unions/ContentBlock';

const Block = new GraphQLObjectType<BlockParent, Context>({
  name: 'Block',
  interfaces: () => [NodeInterfaceType],
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Is a not real Block ID',
      resolve: parent => `fakeID:block:${parent.id}`,
    },
    contentBlock: {
      type: new GraphQLNonNull(ContentBlock),
      resolve: parent => parent,
    },
  }),
});

export default Block;
