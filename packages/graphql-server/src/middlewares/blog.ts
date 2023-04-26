import { Middleware } from '@via-profit-services/core';
import DataLoader from 'dataloader';

import type { PagesMiddlewareFactory } from 'webpages';
import BlogService from '~/services/BlogService';

const factory: PagesMiddlewareFactory = () => {
  const middleware: Middleware = async ({ context }) => {
    const { services } = context;

    // Check to dataloader exist in context
    if (typeof context.dataloader === 'undefined') {
      (context.dataloader as any) = {};
    }

    services.blog = new BlogService({
      knex: context.knex,
    });

    context.dataloader.blog = new DataLoader(async ids => {
      const { edges } = await services.blog.getPostsConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });
  };

  return middleware;
};

export default factory;
