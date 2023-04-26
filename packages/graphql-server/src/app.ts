/* eslint-disable import/max-dependencies */
import http from 'node:http';
import { graphqlHTTPFactory } from '@via-profit-services/core';
import * as permissions from '@via-profit-services/permissions';

import routes from '~/routes';
import users from '~/middlewares/users';
import knex from '~/middlewares/knex';
import subscriptions from '~/middlewares/subscriptions';
import files from '~/middlewares/files';
import redis from '~/middlewares/redis';
import clients from '~/middlewares/clients';
import deals from '~/middlewares/deals';
import logger from '~/middlewares/logger';
import webpages from '~/middlewares/webpages';
import webmenu from '~/middlewares/webmenu';
import blog from '~/middlewares/blog';
import schema from '~/schema';
import config from '~/config';
import LoggerService from '~/services/LoggerService';
import FilesService from '~/services/FilesService';
import persistedQueriesMap from '~/relay/persisted-queries.json';
import { PERSISTED_QUERY_KEY } from './utils/constants';

const bootstrap = () => {
  const loggerService = new LoggerService(config.logs);
  const server = http.createServer();

  loggerService.log('info', 'bootstrap', 'Init');
  loggerService.log('info', 'bootstrap', 'Clear files cache');
  FilesService.clearExpiredCache(config.files.cachePath, 0);

  const filesInterval = setInterval(() => {
    loggerService.log('info', 'bootstrap', 'Clear files expired cache');
    FilesService.clearExpiredCache(config.files.cachePath, 86400 * 1000 * 30);
  }, 86400 * 1000);

  const usersMiddleware = users({ jwt: config.jwt });
  const clientsMiddleware = clients();
  const dealsMiddleware = deals();
  const webpagesMiddleware = webpages();
  const webmenuMiddleware = webmenu();
  const loggerMiddleware = logger({ logger: loggerService });
  const permissionsMiddleware = permissions.factory(config.permissions);
  const filesMiddleware = files(config.files);
  const blogMiddleware = blog();
  const subscriptionsMiddleware = subscriptions({ ...config, server, loggerService });
  const { knexMiddleware, knexInstance } = knex(config);
  const { redisInstance, redisMiddleware } = redis({ ...config, server, loggerService });

  const graphqlHTTP = graphqlHTTPFactory({
    schema,
    persistedQueriesMap,
    debug: config.debug,
    persistedQueryKey: PERSISTED_QUERY_KEY,
    middleware: [
      loggerMiddleware, // must be first at all
      knexMiddleware,
      redisMiddleware,
      subscriptionsMiddleware,
      usersMiddleware,
      clientsMiddleware,
      dealsMiddleware,
      webpagesMiddleware,
      webmenuMiddleware,
      filesMiddleware,
      blogMiddleware,
      permissionsMiddleware, // must be last at all
    ],
  });

  server.on('request', async (req, res) => {
    await routes({
      req,
      res,
      graphqlHTTP,
      loggerService,
      redisInstance,
      ...config,
    });
  });

  server.on('close', () => {
    clearInterval(filesInterval);
    knexInstance.destroy();
    loggerService.log('info', 'bootstrap', 'Server stopped');
  });

  return { server, config, knexInstance, redisInstance, loggerService };
};

export default bootstrap;
