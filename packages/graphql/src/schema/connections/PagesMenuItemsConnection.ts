import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import PageMenuItemEdge from '~/schema/connections/PageMenuItemEdge';

const PagesMenuItemConnection = new GraphQLObjectType({
  name: 'PagesMenuItemConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PageMenuItemEdge))) },
  }),
});

export default PagesMenuItemConnection;
