import {
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from 'graphql';
import type { Context } from '@via-profit-services/core';

import type { GetNotificationsConnectionProps } from 'notifications';
import NotificationConnection from '~/schema/connections/NotificationConnection';
import NotificationSearch from '~/schema/inputs/NotificationSearch';
import NotificationStatus from '~/schema/enums/NotificationStatus';
import NotificationCategory from '~/schema/enums/NotificationCategory';
import NotificationOrderBy from '~/schema/inputs/NotificationsOrderBy';

const list: GraphQLFieldConfig<unknown, Context, GetNotificationsConnectionProps> = {
  description: 'Returns the list of notifications',
  type: new GraphQLNonNull(NotificationConnection),
  args: {
    first: { type: GraphQLInt },
    last: { type: GraphQLInt },
    after: { type: GraphQLString },
    before: { type: GraphQLString },
    status: { type: new GraphQLList(new GraphQLNonNull(NotificationStatus)) },
    category: { type: new GraphQLList(new GraphQLNonNull(NotificationCategory)) },
    recipient: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
    ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
    orderBy: { type: new GraphQLList(new GraphQLNonNull(NotificationOrderBy)) },
    search: { type: new GraphQLList(new GraphQLNonNull(NotificationSearch)) },
  },
  resolve: async (_p, args, context) => {
    const { services } = context;
    const { first, last, before } = args;

    if (!first && !last) {
      throw new Error('Missing «first» or «last» argument. You must provide one of the argument');
    }

    if (first && last) {
      throw new Error('Got «first» and «last» arguments. You must provide one of the argument');
    }

    if (last && !before) {
      throw new Error('Missing «before» argument. You must provide cursor value');
    }

    if (typeof first === 'number' && first < 0) {
      throw new Error('Argument «first» must be a positive integer value');
    }

    if (typeof last === 'number' && last < 0) {
      throw new Error('Argument «last» must be a positive integer value');
    }

    return await services.notifications.getNotificationsConnection(args);
  },
};

export default list;
