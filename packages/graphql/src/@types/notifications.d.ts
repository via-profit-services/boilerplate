declare module 'notifications' {
  import { GraphQLFieldResolver } from 'graphql';
  import { Middleware, CursorConnection, Context } from '@via-profit-services/core';
  import { Knex } from 'knex';

  export type MiddlewareFactory = () => Middleware;

  export type NotificationStatus = 'created' | 'read';
  export type NotificationCategory = 'normal' | 'critical' | 'warn';
  export type NotificationsEntityType = 'User';
  export type NotificationActionName = 'void';

  export interface NotificationsTableModel {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly title: string;
    readonly text: string;
    readonly recipient: string;
    readonly recipientType: NotificationsEntityType;
    readonly category: NotificationCategory;
    readonly status: NotificationStatus;
    readonly actions: string | null;
  }

  export type NotificationsTableRecord = Omit<
    NotificationsTableModel,
    'createdAt' | 'updatedAt' | 'action'
  > & {
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly actions: readonly NotificationAction[] | null;
  };

  export type NotificationAction = {
    readonly name: NotificationActionName;
    readonly payload?: any | null;
  };

  export interface Notification {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly title: string;
    readonly text: string;
    readonly recipient: string;
    readonly recipientType: NotificationsEntityType;
    readonly category: NotificationCategory;
    readonly status: NotificationStatus;
    readonly actions: readonly NotificationAction[] | null;
  }

  export type NotificationsServiceProps = {
    readonly knex: Knex;
    readonly timezone: string;
  };

  export interface GetNotificationsConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly orderBy?:
      | {
          readonly field: 'createdAt' | 'updatedAt';
          readonly direction: 'asc' | 'desc';
        }[]
      | null;
    readonly search?:
      | {
          readonly field: 'title' | 'text';
          readonly query: string;
        }[]
      | null;
    readonly recipient?: readonly string[] | null;
    readonly ids?: readonly string[] | null;
    readonly status?: readonly NotificationStatus[] | null;
    readonly category?: readonly NotificationCategory[] | null;
  }

  export interface NotificationsConnectionCursor {
    offset: number;
    ids?: GetNotificationsConnectionProps['ids'];
    status?: GetNotificationsConnectionProps['status'];
    orderBy?: GetNotificationsConnectionProps['orderBy'];
    search?: GetNotificationsConnectionProps['search'];
    recipient?: GetNotificationsConnectionProps['recipient'];
    category?: GetNotificationsConnectionProps['category'];
  }

  export type CreateNotificationRecipient = {
    readonly id: string;
    readonly type: NotificationsEntityType;
  };
  export type CreateNotificationParams = Omit<
    NotificationsTableModel,
    'id' | 'recipient' | 'recipientType' | 'createdAt' | 'updatedAt' | 'status' | 'actions'
  > & {
    readonly id?: string;
    readonly actions?: null | readonly NotificationAction[];
  };

  export interface NotificationsServiceInterface {
    getNotificationsConnection(
      params: GetNotificationsConnectionProps,
    ): Promise<CursorConnection<Notification>>;
    createNotification(
      recipients: readonly CreateNotificationRecipient[],
      params: CreateNotificationParams,
    ): Promise<readonly string[]>;
    deleteNotifications(ids: readonly string[]): Promise<readonly string[]>;
    setStatus(ids: readonly string[], status: NotificationStatus): Promise<readonly string[]>;
    markAllAsRead(recipient: string): Promise<readonly string[]>;
    getNotificationsCounter(recipients: readonly string[]): Promise<NotificationsCounterResult>;
  }

  export type NotificationsCounterResult = readonly {
    readonly recipient: string;
    readonly counter: number;
  }[];

  interface NotificationsService extends NotificationsServiceInterface {}
  export class NotificationsService {
    constructor(props: NotificationsServiceProps);
  }

  export type Resolvers = {
    readonly Query: {
      readonly notifications: GraphQLFieldResolver<unknown, Context>;
    };
    readonly Mutation: {
      readonly notifications: GraphQLFieldResolver<unknown, Context>;
    };
    readonly NotificationMutation: {
      readonly create: GraphQLFieldResolver<
        unknown,
        Context,
        {
          readonly input: {
            readonly id?: string | null;
            readonly title: string;
            readonly text: string;
            readonly recipient: string;
            readonly recipientType: NotificationsEntityType;
            readonly category: NotificationCategory;
          };
        }
      >;
      readonly setStatus: GraphQLFieldResolver<
        unknown,
        Context,
        {
          readonly ids: readonly string[];
          readonly status: NotificationStatus;
        }
      >;
      readonly markAllAsRead: GraphQLFieldResolver<unknown, Context>;
    };
    readonly NotificationsQuery: {
      readonly list: GraphQLFieldResolver<
        unknown,
        Context,
        {
          readonly first?: number | null;
          readonly last?: number | null;
          readonly after?: string | null;
          readonly before?: string | null;
          readonly status?: readonly NotificationStatus[] | null;
          readonly category?: readonly NotificationCategory[] | null;
          readonly recipient?: readonly string[] | null;
          readonly search?:
            | {
                readonly field: 'title' | 'text';
                readonly query: string;
              }[]
            | null;
          readonly orderBy?:
            | {
                readonly field: 'createdAt' | 'updatedAt';
                readonly direction: 'asc' | 'desc';
              }[]
            | null;
        }
      >;
      readonly unreaded: GraphQLFieldResolver<
        unknown,
        Context,
        {
          readonly recipient: string;
        }
      >;
    };
    readonly Notification: Record<
      keyof Omit<Notification, 'recipientType'>,
      GraphQLFieldResolver<Notification, Context>
    >;
  };
}
