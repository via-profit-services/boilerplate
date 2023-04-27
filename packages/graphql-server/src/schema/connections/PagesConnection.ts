import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import PageEdge from '~/schema/connections/PageEdge';

const PagesConnection = new GraphQLObjectType({
  name: 'PagesConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PageEdge))) },
  }),
});

export default PagesConnection;
