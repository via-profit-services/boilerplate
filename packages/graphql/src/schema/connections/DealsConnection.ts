import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PageInfoType, ConnectionInterfaceType } from '@via-profit-services/core';

import DealEdge from '~/schema/connections/DealEdge';

const DealsConnection = new GraphQLObjectType({
  name: 'DealsConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(DealEdge))) },
  }),
});

export default DealsConnection;
