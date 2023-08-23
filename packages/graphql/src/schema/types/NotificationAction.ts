import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { JSONScalarType } from '@via-profit-services/core';

import NotificationActionName from '~/schema/enums/NotificationActionName';

const NotificationAction = new GraphQLObjectType({
  name: 'NotificationAction',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(NotificationActionName),
      payload: JSONScalarType,
    },
  }),
});

export default NotificationAction;
