import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '@via-profit-services/core';
import { withFilter } from 'graphql-subscriptions';

import SubscriptionTrigger from '~/schema/subscriptions/SubscriptionTrigger';
import NotificationCounterSubscriptionPayload, {
  NotificationCounterSubscriptionPayloadType,
} from '~/schema/types/NotificationCounterSubscriptionPayload';

interface Args {
  readonly recipient: string;
}

interface Payload {
  readonly notificationCounterWasUpdated: NotificationCounterSubscriptionPayloadType;
}

const notificationWasUpdated: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(NotificationCounterSubscriptionPayload),
  subscribe: withFilter(
    (_parent, _args: Args, context: Context) =>
      context.pubsub.asyncIterator(SubscriptionTrigger.NOTIFICATION_COUNTER_UPDATED),
    (payload: Payload, args: Args) => {
      const { recipient } = payload.notificationCounterWasUpdated;

      return recipient === args.recipient;
    },
  ),
};

export default notificationWasUpdated;
