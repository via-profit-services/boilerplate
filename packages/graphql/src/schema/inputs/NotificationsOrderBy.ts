import { OrderDirectionType } from '@via-profit-services/core';
import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql';

import NotificationOrderField from '~/schema/enums/NotificationOrderField';

const NotificationOrderBy = new GraphQLInputObjectType({
  name: 'NotificationOrderBy',
  fields: () => ({
    field: { type: new GraphQLNonNull(NotificationOrderField) },
    direction: { type: new GraphQLNonNull(OrderDirectionType) },
  }),
});

export default NotificationOrderBy;
