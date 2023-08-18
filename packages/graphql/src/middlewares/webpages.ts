import { Middleware } from '@via-profit-services/core';
import DataLoader from 'dataloader';

import type { PagesMiddlewareFactory } from 'webpages';
import PagesService from '~/services/PagesService';

const factory: PagesMiddlewareFactory = () => {
  const middleware: Middleware = async ({ context }) => {
    const { services } = context;

    // Check to dataloader exist in context
    if (typeof context.dataloader === 'undefined') {
      (context.dataloader as any) = {};
    }

    services.webpages = new PagesService({ knex: context.knex });

    context.dataloader.webpages = new DataLoader(async ids => {
      const { edges } = await services.webpages.getPagesConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });

    context.dataloader.contentBlocks = new DataLoader(async ids => {
      const { edges } = await services.webpages.getContentBlocksConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });

    context.dataloader.templates = new DataLoader(async ids => {
      const { edges } = await services.webpages.getTemplatesConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });
  };

  return middleware;
};

export default factory;
