import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFieldConfig,
} from 'graphql';
import { Context } from '@via-profit-services/core';

import TokenType from '~/schema/enums/TokenType';
import AccessTokenPayload from '~/schema/types/AccessTokenPayload';
import type { RefreshTokenPayload as Parent } from 'users';

const RefreshTokenPayload = new GraphQLObjectType({
  name: 'RefreshTokenPayload',
  description: 'Refresh token payload',
  fields: () => {
    const fields: Record<keyof Parent, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      auid: { type: new GraphQLNonNull(GraphQLID) },
      uuid: { type: new GraphQLNonNull(GraphQLID) },
      exp: { type: new GraphQLNonNull(GraphQLInt) },
      iss: { type: GraphQLString },
      type: {
        type: new GraphQLNonNull(TokenType),
        resolve: () => 'refresh',
      },
      associated: {
        type: new GraphQLNonNull(AccessTokenPayload),
        resolve: async (parent, _args, context) => {
          const { associated } = parent;
          const { token, emitter } = context;

          if (associated.id === token.id) {
            return token;
          }

          emitter.emit(
            'log-error',
            'authentification',
            `Failed to get associated token with ID ${associated.id}`,
          );
          throw new Error('Associated token can not be found');
        },
      },
    };

    return fields;
  },
});

export default RefreshTokenPayload;
