import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { EdgeInterfaceType } from '@via-profit-services/core';

import PageMenu from '~/schema/types/PageMenu';

const PageMenuEdge = new GraphQLObjectType({
  name: 'PageMenuEdge',
  interfaces: [EdgeInterfaceType],
  fields: () => ({
    cursor: { type: new GraphQLNonNull(GraphQLString) },
    node: { type: new GraphQLNonNull(PageMenu) },
  }),
});

export default PageMenuEdge;
