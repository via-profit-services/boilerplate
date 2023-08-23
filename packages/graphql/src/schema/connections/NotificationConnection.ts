import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ConnectionInterfaceType, PageInfoType } from '@via-profit-services/core';

import NotificationEdge from '~/schema/connections/NotificationEdge';

const NotificationConnection = new GraphQLObjectType({
  name: 'NotificationConnection',
  interfaces: [ConnectionInterfaceType],
  fields: () => ({
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(NotificationEdge))) },
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
  }),
});

export default NotificationConnection;
