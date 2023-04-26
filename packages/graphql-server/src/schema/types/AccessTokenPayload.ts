import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLFieldConfig,
} from 'graphql';
import { Context } from '@via-profit-services/core';

import TokenType from '~/schema/enums/TokenType';
import AccountRole from '~/schema/enums/AccountRole';
import type { AccessTokenPayload as Parent } from 'users';

const AccessTokenPayload = new GraphQLObjectType({
  name: 'AccessTokenPayload',
  description: 'Access token payload',
  fields: () => {
    const fields: Record<keyof Parent, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      auid: { type: new GraphQLNonNull(GraphQLID) },
      uuid: { type: new GraphQLNonNull(GraphQLID) },
      exp: { type: new GraphQLNonNull(GraphQLInt) },
      iss: { type: GraphQLString },
      roles: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AccountRole))) },
      privileges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
      type: {
        type: new GraphQLNonNull(TokenType),
        resolve: () => 'access',
      },
    };

    return fields;
  },
});

export default AccessTokenPayload;
