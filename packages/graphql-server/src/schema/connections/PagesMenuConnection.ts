import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import PageMenuEdge from '~/schema/connections/PageMenuEdge';

const PagesMenuConnection = new GraphQLObjectType({
  name: 'PagesMenuConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PageMenuEdge))) },
  }),
});

export default PagesMenuConnection;
