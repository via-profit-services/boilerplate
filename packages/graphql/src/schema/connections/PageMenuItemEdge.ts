import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { EdgeInterfaceType } from '@via-profit-services/core';

import PageMenuItem from '~/schema/types/PageMenuItem';

const PageMenuItemEdge = new GraphQLObjectType({
  name: 'PageMenuItemEdge',
  interfaces: [EdgeInterfaceType],
  fields: () => ({
    cursor: { type: new GraphQLNonNull(GraphQLString) },
    node: { type: new GraphQLNonNull(PageMenuItem) },
  }),
});

export default PageMenuItemEdge;
