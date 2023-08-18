import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '@via-profit-services/core';
// import { withFilter } from 'graphql-subscriptions';

import User from '~/schema/types/User';
import SubscriptionTrigger from './SubscriptionTrigger';

const userWasUpdated: GraphQLFieldConfig<unknown, Context> = {
  type: new GraphQLNonNull(User),
  description: 'Fired when user data was updated',
  subscribe: (_parent, _args, context) =>
    context.pubsub.asyncIterator(SubscriptionTrigger.USER_WAS_UPDATED),
};

export default userWasUpdated;
