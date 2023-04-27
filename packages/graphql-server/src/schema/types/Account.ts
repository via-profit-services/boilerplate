import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context, DateTimeScalarType, NodeInterfaceType } from '@via-profit-services/core';

import type { Account as Parent } from 'users';
import User from '~/schema/types/User';
import AccountStatus from '~/schema/enums/AccountStatus';
import AccountRole from '~/schema/enums/AccountRole';

const Account = new GraphQLObjectType<Parent, Context>({
  interfaces: () => [NodeInterfaceType],
  name: 'Account',
  fields: () => {
    const fields: Record<keyof Parent, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      login: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      status: { type: new GraphQLNonNull(AccountStatus) },
      privileges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      roles: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AccountRole))) },
      user: {
        type: User,
        resolve: async (parent, _args, context) => {
          const { user } = parent;
          const { dataloader } = context;

          if (user) {
            return await dataloader.users.load(user);
          }

          return null;
        },
      },
    };

    return fields;
  },
});

export default Account;
