import { GraphQLObjectType } from 'graphql';
import { Context } from '@via-profit-services/core';

import userWasUpdated from '~/schema/subscriptions/userWasUpdated';
import notificationWasCreated from '~/schema/subscriptions/notificationWasCreated';
import notificationWasUpdated from '~/schema/subscriptions/notificationWasUpdated';
import notificationCounterWasUpdated from '~/schema/subscriptions/notificationCounterWasUpdated';

const Subscription = new GraphQLObjectType<unknown, Context>({
  name: 'Subscription',
  fields: () => ({
    userWasUpdated,
    notificationWasCreated,
    notificationWasUpdated,
    notificationCounterWasUpdated,
  }),
});

export default Subscription;
