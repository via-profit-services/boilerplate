import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '@via-profit-services/core';
// import { withFilter } from 'graphql-subscriptions';

import User from '~/schema/types/User';

const userWasUpdated: GraphQLFieldConfig<unknown, Context> = {
  type: new GraphQLNonNull(User),
  subscribe: (_parent, _args, context) => context.pubsub.asyncIterator('user-was-updated'),
  // subscribe: pubsubFilter<Payload>(
  //   (_parent, _args, context: Context) => {
  //     const { pubsub } = context;

  //     return pubsub.asyncIterator('user-was-updated');
  //   },
  //   (payload, _args, context: Context) => {
  //     const { id } = payload.userWasUpdated;
  //     const { token } = context;

  //     return id === token.uuid;
  //   },
  // ),
};

export default userWasUpdated;
