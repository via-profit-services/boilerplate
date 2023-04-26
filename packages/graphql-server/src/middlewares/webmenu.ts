import { Middleware } from '@via-profit-services/core';
import DataLoader from 'dataloader';

import type { PagesMiddlewareFactory } from 'webpages';
import MenuService from '~/services/MenuService';

const factory: PagesMiddlewareFactory = () => {
  const middleware: Middleware = async ({ context }) => {
    const { services } = context;

    // Check to dataloader exist in context
    if (typeof context.dataloader === 'undefined') {
      (context.dataloader as any) = {};
    }

    services.webmenu = new MenuService({ knex: context.knex });

    context.dataloader.menus = new DataLoader(async ids => {
      const { edges } = await services.webmenu.getMenuConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });

    context.dataloader.menuItems = new DataLoader(async ids => {
      const { edges } = await services.webmenu.getMenuItemsConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });
  };

  return middleware;
};

export default factory;
