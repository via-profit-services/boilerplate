import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';
import { Context, DateTimeScalarType, NodeInterfaceType } from '@via-profit-services/core';

import type { User as Parent, Account as AccountType, GetUserFilesConnectionProps } from 'users';
import type { FilesTableRecord } from 'files';
import Account from '~/schema/types/Account';
import File from '~/schema/types/File';
import FileType from '~/schema/enums/FileType';
import FilesConnection from '~/schema/connections/FilesConnection';

interface Resolver {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly account: AccountType | null;
  readonly avatar: FilesTableRecord | null;
  readonly files: FilesTableRecord[] | null;
}

const User = new GraphQLObjectType<Parent, Context>({
  name: 'User',
  interfaces: () => [NodeInterfaceType],
  fields: () => {
    const fields: Record<keyof Resolver, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      avatar: {
        type: File,
        resolve: async (parent, _args, context) => {
          const { dataloader } = context;
          const { avatar } = parent;

          if (!avatar) {
            return null;
          }

          return await dataloader.files.load(avatar);
        },
      },
      files: {
        type: new GraphQLNonNull(FilesConnection),
        args: {
          first: { type: GraphQLInt },
          last: { type: GraphQLInt },
          after: { type: GraphQLString },
          before: { type: GraphQLString },
          account: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
          type: { type: new GraphQLList(new GraphQLNonNull(FileType)) },
          id: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        },
        resolve: async (parent, args: GetUserFilesConnectionProps, context) => {
          const { id } = parent;
          const { services } = context;
          const { first, last, before } = args;

          if (!first && !last) {
            throw new Error(
              'Missing «first» or «last» argument. You must provide one of the argument',
            );
          }

          if (first && last) {
            throw new Error(
              'Got «first» and «last» arguments. You must provide one of the argument',
            );
          }

          if (last && !before) {
            throw new Error('Missing «before» argument. You must provide cursor value');
          }

          if (typeof first === 'number' && first < 0) {
            throw new Error('Argument «first» must be a positive integer value');
          }

          if (typeof last === 'number' && last < 0) {
            throw new Error('Argument «last» must be a positive integer value');
          }

          const connection = await services.files.getFilesConnection({
            ...args,
            owner: [id],
          });

          return connection;
        },
      },
      account: {
        type: Account,
        resolve: async (parent, _args, context) => {
          const { account } = parent;
          const { dataloader } = context;

          if (account) {
            return await dataloader.accounts.load(account);
          }

          return null;
        },
      },
    };

    return fields;
  },
});

export default User;
