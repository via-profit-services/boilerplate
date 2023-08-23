import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import type { Context } from '@via-profit-services/core';

import SubscriptionTrigger from '~/schema/subscriptions/SubscriptionTrigger';
import NotificationMutationPayload from '~/schema/unions/NotificationMutationPayload';
import NotificationInputCreate, {
  NotificationInputCreateAsArgs,
} from '~/schema/inputs/NotificationInputCreate';

type Args = {
  readonly input: NotificationInputCreateAsArgs;
};

const create: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(NotificationMutationPayload),
  description: 'Create new notification',
  args: {
    input: { type: new GraphQLNonNull(NotificationInputCreate) },
  },
  resolve: async (_p, args, context) => {
    const { services, dataloader, pubsub } = context;
    const { input } = args;
    const { recipient, recipientType, ...restData } = input;

    try {
      const notificationIDs = await services.notifications.createNotification(
        [{ id: recipient, type: recipientType }],
        {
          ...restData,
          category: input.category || 'normal',
        },
      );

      const notifications = await dataloader.notifications
        .clearAll()
        .loadMany(notificationIDs)
        .then(list => list.filter(n => !(n instanceof Error)));

      // Emit Subscription
      pubsub.publish(SubscriptionTrigger.NOTIFICATION_CREATED, {
        notificationWasCreated: notifications,
      });

      // Emit Subscription of notification counter
      pubsub.publish(SubscriptionTrigger.NOTIFICATION_COUNTER_UPDATED, {
        notificationCounterWasUpdated: {
          recipient: input.recipient,
          counter: await dataloader.notificationsCounter
            .clear(input.recipient)
            .load(input.recipient),
        },
      });

      return {
        __typename: 'NotificationMutationSuccess',
        notification: notifications[0],
      };
    } catch (err) {
      return {
        __typename: 'NotificationMutationError',
        name: 'UnknownError',
        msg: err instanceof Error ? err.message : 'Unknown Error',
      };
    }
  },
};

export default create;
