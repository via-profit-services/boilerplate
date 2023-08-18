import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { Context } from '@via-profit-services/core';

import Page from '~/schema/types/Page';
import { REDIS_KEY_PAGES_PATH_CACHE } from '~/utils/constants';

interface Args {
  readonly path?: string | null;
  readonly id?: string | null;
}

const resolvePage: GraphQLFieldConfig<unknown, Context, Args> = {
  type: new GraphQLNonNull(Page),
  description:
    'Resolve the web page. Page will be resolved only if status code of the page equal 200, otherwise Fallback 404 will return',
  args: {
    id: {
      type: GraphQLID,
      description: 'Page iD if you know it',
    },
    path: {
      type: GraphQLString,
      description: 'Web page pathname, eg.: «/path/to»',
    },
  },
  resolve: async (_parent, args, context) => {
    const { dataloader, redis, services } = context;
    const { path, id } = args;

    if (!path && !id) {
      throw new Error('Missing «path» or «id» argument. You must provide one of the argument');
    }

    if (path && id) {
      throw new Error('Got «path» and «id» arguments. You must provide one of the argument');
    }

    // check cahce
    const pageID =
      typeof id === 'string' ? id : await redis.get(`${REDIS_KEY_PAGES_PATH_CACHE}${path}`);

    if (!pageID) {
      const pagesConnection = await services.webpages.getPagesConnection({
        first: 1,
        id: typeof id === 'string' ? [id] : null,
        path: typeof path === 'string' ? [path] : null,
        statusCode: [200],
      });
      const page = pagesConnection.edges.length ? pagesConnection.edges[0].node : null;

      if (page) {
        dataloader.webpages.prime(page.id, page);
        await redis.set(`${REDIS_KEY_PAGES_PATH_CACHE}${page.path}`, page.id, 'PX', 1000 * 60);

        return page;
      }

      // return 404
      const fallbackConnection = await services.webpages.getPagesConnection({
        first: 1,
        path: ['/404'],
      });
      if (!fallbackConnection.edges.length) {
        throw new Error('Failed to load fallback page');
      }

      const fallbackPage = fallbackConnection.edges[0].node;
      await redis.set(
        `${REDIS_KEY_PAGES_PATH_CACHE}${fallbackPage.path}`,
        fallbackPage.id,
        'PX',
        1000 * 60,
      );

      return fallbackPage;
    }

    const page = await dataloader.webpages.load(pageID);

    return page;
  },
};

export default resolvePage;
