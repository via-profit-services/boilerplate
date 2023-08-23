import { v4 as uuidv4 } from 'uuid';
import type {
  Notification,
  NotificationsServiceInterface,
  NotificationsServiceProps,
  GetNotificationsConnectionProps,
  NotificationsConnectionCursor,
  NotificationsTableModel,
  NotificationsTableRecord,
  CreateNotificationParams,
  NotificationStatus,
  CreateNotificationRecipient,
  NotificationsCounterResult,
} from 'notifications';
import type { Knex } from 'knex';
import type { CursorConnection, Edge } from '@via-profit-services/core';

class NotificationsService implements NotificationsServiceInterface {
  #knex: Knex;
  #timezone: string;
  public constructor(props: NotificationsServiceProps) {
    this.#knex = props.knex;
    this.#timezone = props.timezone;
  }

  public async getNotificationsConnection(
    params: GetNotificationsConnectionProps,
  ): Promise<CursorConnection<Notification>> {
    const { first, after, last, before, orderBy, search, status, category, ids, recipient } =
      params;

    let limit = 0;
    let offset = 0;
    let cursor: NotificationsConnectionCursor = {
      offset: 0,
      orderBy,
      search,
      status,
      category,
      recipient,
      ids,
    };

    if (first && !after) {
      limit = first;
      offset = 0;
      cursor.offset = 0;
    }

    if (first && after) {
      cursor = JSON.parse(Buffer.from(after, 'base64').toString('utf8'));
      limit = first;
      offset = Math.max(cursor.offset, 0) + 1;
      cursor.offset = Math.max(cursor.offset, 0) + 1;
    }

    if (last && before) {
      cursor = JSON.parse(Buffer.from(before, 'base64').toString('utf8'));
      limit = last;
      offset = Math.max(cursor.offset - last, 0);
      cursor.offset = Math.max(cursor.offset - last, 0);
    }

    const knexOrderByArray = [...(cursor.orderBy || [])].map(({ field, direction }) => ({
      column: `n.${field}`,
      order: direction,
    }));

    const orderByRaw = this.#knex
      .orderBy(knexOrderByArray)
      .toQuery()
      .replace('select *', '')
      .trim();

    const request = this.#knex
      .select([
        this.#knex.raw('n.*'),
        this.#knex.raw(`lag(??) over(${orderByRaw}) as "prev"`, ['n.id']),
        this.#knex.raw(`lead(??) over(${orderByRaw}) as "next"`, ['n.id']),
      ])
      .orderBy(knexOrderByArray)
      .from<
        NotificationsTableModel,
        (NotificationsTableRecord & {
          prev: string | null;
          next: string | null;
        })[]
      >({ n: 'notifications' })
      .limit(limit)
      .offset(offset);

    if (cursor.search) {
      request.where(builder => {
        search.forEach(({ field, query }) => {
          switch (field) {
            case 'title':
              query.length && builder.orWhereRaw('??::text ilike ?', ['n.title', `%${query}%`]);
              break;
            case 'text':
              query.length && builder.orWhereRaw('??::text ilike ?', ['n.text', `%${query}%`]);
              break;

            default:
              // do nothing
              break;
          }
        });
      });
    }

    if (Array.isArray(cursor.ids)) {
      request.whereIn('n.id', cursor.ids);
    }

    if (Array.isArray(cursor.status)) {
      request.whereIn('n.status', cursor.status);
    }

    if (Array.isArray(cursor.category)) {
      request.whereIn('n.category', cursor.category);
    }

    if (Array.isArray(cursor.recipient)) {
      request.whereIn('n.recipient', cursor.recipient);
    }

    const response = await request;

    const edges: Edge<Notification>[] = response.map((node, index) => ({
      node,
      cursor: Buffer.from(
        JSON.stringify({
          ...cursor,
          offset: cursor.offset + index,
        }),
      ).toString('base64'),
    }));

    const pageInfo = {
      hasPreviousPage: edges.length ? response[0].prev !== null : false,
      hasNextPage: edges.length ? response[response.length - 1].next !== null : false,
      startCursor: edges.length ? edges[0].cursor : undefined,
      endCursor: edges.length ? edges[edges.length - 1].cursor : undefined,
    };

    return {
      pageInfo,
      edges,
    };
  }

  public async createNotification(
    recipients: readonly CreateNotificationRecipient[],
    params: CreateNotificationParams,
  ): Promise<readonly string[]> {
    const { actions, ...restParams } = params;

    const createdAt = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: this.#timezone,
        timeZoneName: 'short',
      }),
    ).toISOString();

    const rows: NotificationsTableModel[] = recipients.map(({ id, type }) => ({
      recipient: id,
      recipientType: type,
      id: typeof restParams.id === 'string' ? restParams.id : uuidv4(),
      ...restParams,
      actions:
        typeof actions === 'undefined'
          ? null
          : typeof actions === 'string'
          ? actions
          : JSON.stringify(actions),
      createdAt,
      updatedAt: createdAt,
      status: 'created',
    }));

    const result = await this.#knex<NotificationsTableModel>('notifications')
      .insert(rows)
      .returning('id');

    return result.map(({ id }) => id);
  }

  public async deleteNotifications(ids: readonly string[]): Promise<readonly string[]> {
    const result = await this.#knex<NotificationsTableModel>('notifications')
      .del()
      .whereIn('id', ids)
      .returning('id');

    return result.map(r => r.id);
  }

  public async setStatus(
    ids: readonly string[],
    status: NotificationStatus,
  ): Promise<readonly string[]> {
    const updatedAt = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: this.#timezone,
        timeZoneName: 'short',
      }),
    ).toISOString();

    const result = await this.#knex<NotificationsTableModel>('notifications')
      .update({ status, updatedAt })
      .whereIn('id', ids)
      .returning('id');

    return result.map(r => r.id);
  }

  public async markAllAsRead(recipient: string): Promise<readonly string[]> {
    const updatedAt = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: this.#timezone,
        timeZoneName: 'short',
      }),
    ).toISOString();

    const result = await this.#knex<NotificationsTableModel>('notifications')
      .update({ status: 'read', updatedAt })
      .where({ recipient })
      .returning('id');

    return result.map(r => r.id);
  }

  public async getNotificationsCounter(
    recipients: readonly string[],
  ): Promise<NotificationsCounterResult> {
    const response = await this.#knex
      .select(this.#knex.raw('recipient, count(*) as ??', ['counter']))
      .from<NotificationsTableModel, NotificationsCounterResult>('notifications')
      .whereIn('recipient', recipients)
      .whereNotIn('status', ['read'])
      .groupBy('recipient');

    return response;
  }
}

export default NotificationsService;
