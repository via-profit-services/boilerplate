import {
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { NodeInterfaceType, Context, DateTimeScalarType } from '@via-profit-services/core';

import type { Notification as Parent } from 'notifications';
import NotificationCategory from '~/schema/enums/NotificationCategory';
import NotificationEntity from '~/schema/unions/NotificationEntity';
import NotificationStatus from '~/schema/enums/NotificationStatus';
import NotificationAction from '~/schema/types/NotificationAction';

type Resolver = Omit<Parent, 'recipientType'>;

const Notification = new GraphQLObjectType<Parent, Context>({
  name: 'Notification',
  interfaces: [NodeInterfaceType],
  fields: () => {
    const fields: Record<keyof Resolver, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      text: { type: new GraphQLNonNull(GraphQLString) },
      category: { type: new GraphQLNonNull(NotificationCategory) },
      status: { type: new GraphQLNonNull(NotificationStatus) },
      actions: { type: new GraphQLList(new GraphQLNonNull(NotificationAction)) },
      recipient: {
        type: new GraphQLNonNull(NotificationEntity),
        resolve: async (parent, _args, context) => {
          const { dataloader } = context;
          const { recipient, recipientType } = parent;
          let node;

          switch (recipientType) {
            case 'User':
              node = await dataloader.users.load(recipient);

              break;

            default:
              node = null;
              break;
          }

          return {
            __typename: recipientType,
            ...node,
          };
        },
      },
    };

    return fields;
  },
});

export default Notification;
