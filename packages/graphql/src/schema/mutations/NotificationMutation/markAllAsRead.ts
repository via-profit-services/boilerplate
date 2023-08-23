import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '@via-profit-services/core';

import type { Notification as NotificationType } from 'notifications';
import NotificationMutationUpdatePayload from '~/schema/types/NotificationMutationUpdatePayload';
import SubscriptionTrigger from '~/schema/subscriptions/SubscriptionTrigger';

const markAllAsRead: GraphQLFieldConfig<unknown, Context> = {
  type: new GraphQLNonNull(NotificationMutationUpdatePayload),
  description: 'Mark your notifications all as read',
  resolve: async (_p, _args, context) => {
    const { token, dataloader, services, pubsub } = context;
    const user = await dataloader.users.load(token.uuid);

    if (!user) {
      return {
        __typename: 'NotificationMutationUpdateError',
        name: 'User not found',
        msg: 'Failed to get user from current auhorization',
      };
    }

    try {
      const affectedIDs = await services.notifications.markAllAsRead(user.id);
      dataloader.notifications.clearAll();
      const notifications = await dataloader.notifications
        .loadMany(affectedIDs)
        .then(list => list.filter((n): n is NotificationType => !(n instanceof Error)));

      // update counters
      const recipientIDs = [...new Set(notifications.map(n => n.recipient))];
      await recipientIDs.reduce(async (prev, recipient) => {
        await prev;

        pubsub.publish(SubscriptionTrigger.NOTIFICATION_COUNTER_UPDATED, {
          notificationCounterWasUpdated: {
            recipient: recipient,
            counter: 0,
          },
        });
      }, Promise.resolve());

      pubsub.publish(SubscriptionTrigger.NOTIFICATION_UPDATED, {
        notificationWasUpdated: notifications,
      });

      return {
        __typename: 'NotificationMutationUpdateSuccess',
        notifications,
      };
    } catch (err) {
      return {
        __typename: 'NotificationMutationUpdateError',
        name: 'UnknownError',
        msg: err instanceof Error ? err.message : 'Unknown Error',
      };
    }
  },
};

export default markAllAsRead;
