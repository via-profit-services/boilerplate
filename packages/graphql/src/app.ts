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
import notifications from '~/middlewares/notifications';
import schema from '~/schema';
import config from '~/config';
import LoggerService from '~/services/LoggerService';
import FilesService from '~/services/FilesService';
import persistedQueriesMap from '~/relay/persisted-queries.json';
import { PERSISTED_QUERY_KEY } from '~/utils/constants';

/**
 * Bootstrap - Start of this programю
 * In this method, we define the application configuration,
 * connect all the necessary middlewares, event listeners,
 * but do not start the server
 */
const bootstrap = () => {
  const loggerService = new LoggerService(config.logs);
  const server = http.createServer();

  loggerService.log('info', 'bootstrap', 'Init');
  loggerService.log('info', 'bootstrap', 'Clear files cache');
  FilesService.clearExpiredCache(config.files.cachePath, 0);

  // Timeout after which cache files will be deleted
  const filesInterval = setInterval(() => {
    loggerService.log('info', 'bootstrap', 'Clear files expired cache');
    FilesService.clearExpiredCache(config.files.cachePath, 86400 * 1000 * 30);
  }, 86400 * 1000);

  /**
   * Middlewares initialization
   * This middlewares - is a @via-profit-services/core middlewares
   */
  const usersMiddleware = users({ jwt: config.jwt });
  const clientsMiddleware = clients();
  const dealsMiddleware = deals();
  const webpagesMiddleware = webpages();
  const webmenuMiddleware = webmenu();
  const loggerMiddleware = logger({ logger: loggerService });
  const permissionsMiddleware = permissions.factory(config.permissions);
  const filesMiddleware = files(config.files);
  const blogMiddleware = blog();
  const notificationsMiddleware = notifications();
  const subscriptionsMiddleware = subscriptions({ ...config, server, loggerService });
  const { knexMiddleware, knexInstance } = knex(config);
  const { redisInstance, redisMiddleware } = redis({ ...config, server, loggerService });

  // Init the @via-profit-services/core HTTP factory
  // for HTTP server event listeners
  const graphqlHTTP = graphqlHTTPFactory({
    schema,
    persistedQueriesMap,
    debug: config.debug,
    persistedQueryKey: PERSISTED_QUERY_KEY,
    middleware: [
      /**
       * IMPORTANT! This middleware must be first at all
       * for can logging all events
       */
      loggerMiddleware,

      /**
       * Database ORM
       * Connect it as early as possible
       */
      knexMiddleware,

      /**
       * Redis database
       * Connect it as early as possible
       */
      redisMiddleware,
      subscriptionsMiddleware,
      usersMiddleware,
      clientsMiddleware,
      dealsMiddleware,
      webpagesMiddleware,
      webmenuMiddleware,
      filesMiddleware,
      blogMiddleware,
      notificationsMiddleware,

      /**
       * IMPORTANT! This middleware must be last at all
       * because it modify the schema and resolvers
       */
      permissionsMiddleware,
    ],
  });

  // Affect HTTP incomming requests
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

  // When server will be stopped
  server.on('close', () => {
    clearInterval(filesInterval);
    knexInstance.destroy();
    loggerService.log('info', 'bootstrap', 'Server stopped');
  });

  return { server, config, knexInstance, redisInstance, loggerService };
};

export default bootstrap;
