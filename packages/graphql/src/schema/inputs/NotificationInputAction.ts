import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { JSONScalarType } from '@via-profit-services/core';

import NotificationActionName from '~/schema/enums/NotificationActionName';

const NotificationInputAction = new GraphQLInputObjectType({
  name: 'NotificationInputAction',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(NotificationActionName),
    },
    payload: {
      type: JSONScalarType,
    },
  }),
});

export default NotificationInputAction;
