import { Context } from '@via-profit-services/core';
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';

import Me from '~/schema/unions/Me';

const me: GraphQLFieldConfig<unknown, Context> = {
  type: new GraphQLNonNull(Me),
  resolve: async (_parent, _args, context) => {
    const { dataloader, token } = context;

    if (token.uuid) {
      const user = await dataloader.users.load(token.uuid);

      return {
        __typename: 'User',
        ...user,
      };
    }

    return null;
  },
};

export default me;
