import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { EdgeInterfaceType } from '@via-profit-services/core';

import Notification from '~/schema/types/Notification';

const NotificationEdge = new GraphQLObjectType({
  name: 'NotificationEdge',
  interfaces: [EdgeInterfaceType],
  fields: () => ({
    node: { type: new GraphQLNonNull(Notification) },
    cursor: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export default NotificationEdge;
