import type { Middleware } from '@via-profit-services/core';
import DataLoader from 'dataloader';

import type { MiddlewareFactory } from 'notifications';
import NotificationsService from '~/services/NotificationsService';

const factory: MiddlewareFactory = () => {
  const middleware: Middleware = async ({ context }) => {
    const { services } = context;

    // Check to dataloader exist in context
    if (typeof context.dataloader === 'undefined') {
      (context.dataloader as any) = {};
    }

    services.notifications = new NotificationsService({
      knex: context.knex,
      timezone: context.timezone,
    });

    context.dataloader.notifications = new DataLoader(async ids => {
      const { edges } = await services.notifications.getNotificationsConnection({
        first: ids.length,
        ids,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });

    context.dataloader.notificationsCounter = new DataLoader(async ids => {
      const counters = await services.notifications.getNotificationsCounter(ids);

      return ids.map(id => counters.find(record => record.recipient === id)?.counter || null);
    });
  };

  return middleware;
};

export default factory;
