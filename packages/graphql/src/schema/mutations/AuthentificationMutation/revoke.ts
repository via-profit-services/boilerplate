import { GraphQLNonNull, GraphQLID, GraphQLFieldConfig } from 'graphql';
import { Context, VoidScalarType } from '@via-profit-services/core';

type Args = {
  tokenID: string;
};

const revoke: GraphQLFieldConfig<unknown, Context, Args> = {
  type: VoidScalarType,
  args: {
    tokenID: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (_parent, args, context) => {
    const { tokenID } = args;
    const { services, emitter } = context;

    emitter.emit('log-info', 'authentification', `Token with ID: «${tokenID}» was revoked by user`);
    await services.authentification.revokeToken(tokenID);

    return null;
  },
};

export default revoke;
