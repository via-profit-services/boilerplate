import { GraphQLFieldConfig, GraphQLNonNull, GraphQLList } from 'graphql';
import { Context } from '@via-profit-services/core';
import { withFilter } from 'graphql-subscriptions';

import Notification from '~/schema/types/Notification';
import SubscriptionTrigger from '~/schema/subscriptions/SubscriptionTrigger';
import type { Notification as NotificationType } from 'notifications';

interface Args {
  readonly recipient: string;
}

interface Payload {
  readonly notificationWasUpdated: readonly NotificationType[];
}

const notificationWasUpdated: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Notification))),
  subscribe: withFilter(
    (_parent, _args: Args, context: Context) =>
      context.pubsub.asyncIterator(SubscriptionTrigger.NOTIFICATION_CREATED),
    (payload: Payload, args: Args) => {
      const notification = payload.notificationWasUpdated;

      return notification.every(({ recipient }) => recipient === args.recipient);
    },
  ),
};

export default notificationWasUpdated;
