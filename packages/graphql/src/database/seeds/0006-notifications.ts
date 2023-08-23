/* eslint-disable import/prefer-default-export */
import crypto from 'node:crypto';
import type { UsersTableRecord } from 'users';
import type { Knex } from 'knex';
import type {
  NotificationCategory,
  NotificationStatus,
  NotificationsTableModel,
} from 'notifications';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const getRandomCategory = () => {
  const categories: NotificationCategory[] = ['normal', 'critical', 'warn'];

  return categories[randomInt(0, categories.length - 1)];
};

const getRandomStatus = () => {
  const statuses: NotificationStatus[] = ['created', 'read'];

  return statuses[randomInt(0, statuses.length - 1)];
};

export async function seed(knex: Knex): Promise<void> {
  // const randomUsers = await knex.select('*').from<UsersTableRecord>('users').limit(10);
  const devUser = await knex
    .select('*')
    .from<UsersTableRecord>('users')
    .where('name', '=', 'Developer')
    .limit(1)
    .first();

  if (!devUser) {
    return;
  }

  const notifications: NotificationsTableModel[] = [];
  [...new Array(150).keys()].forEach(() => {
    const createdAt = new Date(new Date().getTime() - randomInt(60 * 60, 60 * 60 * 24 * 30) * 1000);

    const notify: NotificationsTableModel = {
      id: crypto.randomUUID(),
      category: getRandomCategory(),
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      title: 'Скоро Новый Год',
      text: 'Сдаём по 1500 рублей на новогоднюю ёлку',
      recipient: devUser.id,
      recipientType: 'User',
      actions: null,
      status: getRandomStatus(),
    };

    notifications.push(notify);
  });

  await knex('notifications').del();
  await knex('notifications').insert(notifications);
}
