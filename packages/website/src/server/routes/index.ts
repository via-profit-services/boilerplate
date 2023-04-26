import http from 'node:http';
import type { Redis } from 'ioredis';

import staticFilesRoute from '~/server/routes/static-files-route';
import faviconRoute from '~/server/routes/favicon-route';
import robotsRoute from '~/server/routes/robots-route';
import renderHTMLRoute from '~/server/routes/render-html-route';
import fallbackRoute from '~/server/routes/fallback-route';

interface Props extends AppConfigProduction {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly redis: Redis;
}

const routes = async (props: Props) => {
  const { req, res, redis, ...appConfig } = props;
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

    case ['HEAD', 'GET'].includes(requestMethod) && requestUrl.match(/^\/public/) !== null:
      return staticFilesRoute({ req, res, redis });

    case ['HEAD', 'GET'].includes(requestMethod) && requestUrl.match(/^\/favicon\.ico/) !== null:
      return faviconRoute({ req, res });

    case ['HEAD', 'GET'].includes(requestMethod) && requestUrl.match(/^\/robots\.txt/) !== null:
      return robotsRoute({ req, res });

    case ['HEAD', 'GET'].includes(requestMethod):
      return await renderHTMLRoute({ req, res, redis, ...appConfig });

    default:
      return fallbackRoute({ req, res });
  }
};

export default routes;
