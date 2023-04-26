import http from 'node:http';
import { HTTPListener } from '@via-profit-services/core';
import { Redis } from 'ioredis';

import type LoggerService from '~/services/LoggerService';
import { ApplicationConfig } from 'common';
import graphqlRoute from '~/routes/graphql-route';
import staticFilesRoute from '~/routes/static-files-route';
import fallbackRoute from '~/routes/fallback-route';
import voyagerRoute from '~/routes/voyager-route';
import persistensRoute from '~/routes/persistens-router';

interface Props extends ApplicationConfig {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly graphqlHTTP: HTTPListener;
  readonly loggerService: LoggerService;
  readonly redisInstance: Redis;
}

const routes = async (props: Props) => {
  const { req, res, endpoint, debug } = props;
  const { method, url } = req;
  const requestUrl = url || '';
  const requestMethod = method || '';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Allow', 'GET, POST, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type, Accept, Content-Length',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Content-Aecurity-Policy',
    "default-src 'self' 'unsafe-inline' ws: wss: http: https: data: blob:",
  );

  switch (true) {
    case ['OPTIONS'].includes(requestMethod):
      return res.end();

    case ['PUT', 'PATCH', 'TRACE', 'DELETE'].includes(requestMethod):
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, POST, HEAD, OPTIONS');

      return res.end();

    case ['HEAD', 'GET', 'POST'].includes(requestMethod) &&
      requestUrl.replace(/\?.*/, '') === endpoint:
      return await graphqlRoute(props);

    case ['HEAD', 'GET'].includes(requestMethod) && requestUrl.match(/^\/static\//) !== null:
      return await staticFilesRoute(props);

    case ['HEAD', 'GET'].includes(requestMethod) && requestUrl.match(/^\/voyager/) !== null:
      return voyagerRoute(props);

    case debug && ['POST'].includes(requestMethod) && requestUrl.match(/^\/persistens/) !== null:
      return persistensRoute(props);

    default:
      return fallbackRoute(props);
  }
};

export default routes;
