import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import NotificationEntityType from '~/schema/enums/NotificationEntityType';
import NotificationCategory from '~/schema/enums/NotificationCategory';
import NotificationInputAction from '~/schema/inputs/NotificationInputAction';
import type {
  NotificationsEntityType,
  NotificationCategory as NotificationCategoryType,
  NotificationAction,
} from 'notifications';

export type NotificationInputCreateAsArgs = {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly recipient: string;
  readonly recipientType: NotificationsEntityType;
  readonly category: NotificationCategoryType;
  readonly actions?: readonly NotificationAction[] | null;
};

const NotificationInputCreate = new GraphQLInputObjectType({
  name: 'NotificationInputCreate',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    recipient: { type: new GraphQLNonNull(GraphQLID) },
    recipientType: { type: new GraphQLNonNull(NotificationEntityType) },
    category: { type: new GraphQLNonNull(NotificationCategory) },
    actions: { type: new GraphQLList(new GraphQLNonNull(NotificationInputAction)) },
  }),
});

export default NotificationInputCreate;
