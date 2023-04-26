import { Middleware } from '@via-profit-services/core';
import DataLoader from 'dataloader';

import type { DealsMiddlewareFactory } from 'deals';
import DealsService from '~/services/DealsService';

const factory: DealsMiddlewareFactory = () => {
  const middleware: Middleware = async ({ context }) => {
    const { services } = context;

    // Check to dataloader exist in context
    if (typeof context.dataloader === 'undefined') {
      (context.dataloader as any) = {};
    }

    services.deals = new DealsService({ knex: context.knex });

    context.dataloader.deals = new DataLoader(async ids => {
      const nodes = await services.deals.getDealsByIds(ids);

      return ids.map(id => nodes.find(node => node.id === id) || null);
    });

    context.dataloader.funnels = new DataLoader(async ids => {
      const nodes = await services.deals.getFunnelsByIds(ids);

      return ids.map(id => nodes.find(node => node.id === id) || null);
    });

    context.dataloader.funnelSteps = new DataLoader(async ids => {
      const nodes = await services.deals.getFunnelStepsByIds(ids);

      return ids.map(id => nodes.find(node => node.id === id) || null);
    });
  };

  return middleware;
};

export default factory;
