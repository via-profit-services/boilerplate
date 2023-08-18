import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { EdgeInterfaceType } from '@via-profit-services/core';

import Block from '~/schema/types/Block';

const BlockEdge = new GraphQLObjectType({
  name: 'BlockEdge',
  interfaces: [EdgeInterfaceType],
  fields: () => ({
    cursor: { type: new GraphQLNonNull(GraphQLString) },
    node: { type: new GraphQLNonNull(Block) },
  }),
});

export default BlockEdge;
