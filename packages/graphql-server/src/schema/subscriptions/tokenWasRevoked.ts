import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql';
import { Context } from '@via-profit-services/core';
import { withFilter } from 'graphql-subscriptions';

const tokenWasRevoked: GraphQLFieldConfig<unknown, Context> = {
  type: new GraphQLNonNull(GraphQLID),
  subscribe: withFilter(
    (_parent, _args, context: Context) => {
      const { pubsub } = context;

      return pubsub.asyncIterator('publish-token-revoked-trigger');
    },
    (payload, _args, context: Context) => {
      const revokedID = payload.tokenWasRevoked;
      const { token } = context;

      return revokedID === token.id;
    },
  ),
};

export default tokenWasRevoked;
