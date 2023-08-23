import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '@via-profit-services/core';

import type {
  NotificationStatus as NotificationStatusType,
  Notification as NotificationType,
} from 'notifications';
import NotificationMutationUpdatePayload from '~/schema/types/NotificationMutationUpdatePayload';
import SubscriptionTrigger from '~/schema/subscriptions/SubscriptionTrigger';

type Args = {
  readonly ids: readonly string[];
  readonly status: NotificationStatusType;
};

const setStatus: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(NotificationMutationUpdatePayload),
  description: 'Change notification status',
  resolve: async (_p, args, context) => {
    const { services, dataloader, pubsub } = context;
    const { ids, status } = args;

    try {
      const affectedIDs = await services.notifications.setStatus(ids, status);
      dataloader.notifications.clearAll();
      const notifications = await dataloader.notifications
        .loadMany(affectedIDs)
        .then(list => list.filter((n): n is NotificationType => !(n instanceof Error)));

      pubsub.publish(SubscriptionTrigger.NOTIFICATION_UPDATED, {
        notificationWasUpdated: notifications,
      });

      // update counters
      const recipientIDs = [...new Set(notifications.map(n => n.recipient))];
      await recipientIDs.reduce(async (prev, recipient) => {
        await prev;

        pubsub.publish(SubscriptionTrigger.NOTIFICATION_COUNTER_UPDATED, {
          notificationCounterWasUpdated: {
            recipient: recipient,
            counter: await dataloader.notificationsCounter.clear(recipient).load(recipient),
          },
        });
      }, Promise.resolve());

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

export default setStatus;
