/* eslint-disable import/max-dependencies */
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import stream from 'node:stream';
import zlib from 'node:zlib';
import Mustache from 'mustache';
import React from 'react';
import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
// import { HelmetProvider, FilledContext as HelmetFilledContext } from 'react-helmet-async';
import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from 'react-router-dom/server';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import { CacheProvider as CSSCacheProvider } from '@emotion/react';
import { fetchQuery } from 'react-relay';
import { Network, Store, RecordSource, Environment } from 'relay-runtime';
import dotenv from 'dotenv';
import type { Redis } from 'ioredis';

import { REDIS_KEY_HTML_CACHE } from '~/server/utils/constants';
import routes from '~/routes';
import relayFetch from '~/server/relay-fetch';
import ReduxProvider from '~/providers/ReduxProvider';
import RelayProvider from '~/providers/RelayProvider';
import query, { PageQuery } from '~/relay/artifacts/PageQuery.graphql';
import ErrorBoundary from '~/components/ErrorBoundary';
import { getCookies } from '~/server/utils/parseCookies';
import reduxDefaultState from '~/redux/reduxDefaultState';
import { getDeviceModeByRequest } from '~/server/utils/getDeviceMode';

interface Props extends AppConfigProduction {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly redis: Redis;
}

dotenv.config();

type RenderHTMLPayload = {
  stream: stream.Readable;
  statusCode: number;
};

// Render function
// Not a route
const renderHTML = async (props: Props): Promise<RenderHTMLPayload> => {
  const { req, graphqlEndpoint, redisCacheExp, redis } = props;
  const { url, headers } = req;
  const host = `http://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;

  const cookies = getCookies(headers);
  const device = cookies.device ?? getDeviceModeByRequest(req);
  const cacheKeyPayload = {
    path: url,
    theme: cookies.theme,
    fontSize: cookies.fontSize,
    locale: cookies.locale,
    device,
  };

  // Generate uniqu cache key
  // Key contain URL and the cookies
  // Do not use all cookies. Only needable
  const cacheKey = crypto
    .createHash('sha256')
    .update(JSON.stringify(cacheKeyPayload))
    .digest('hex');

  const cssCache = createCache({ key: 'app' });
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cssCache);

  if (redisCacheExp > 0) {
    // Try to get cache from Redis by user cache key
    const cachedHTMLData = await redis.get(`${REDIS_KEY_HTML_CACHE}${cacheKey}`);
    if (cachedHTMLData) {
      try {
        const { statusCode, html } = JSON.parse(cachedHTMLData);

        return {
          stream: stream.Readable.from([html]),
          statusCode,
        };
      } catch (err) {
        // do nothing
      }
    }
  }

  // Configure Redux
  // await reduxLoadServerInitialState({ req, headers, graphqlEndpoint });
  // const cookies = getCookies(headers);
  // const device = getDeviceModeByRequest(req);

  reduxDefaultState.setInitialState(state => ({
    ui: {
      ...state.ui,
      theme: cookies.theme ?? state.ui.theme,
      fontSize: cookies.fontSize ?? state.ui.fontSize,
      locale: cookies.locale ?? state.ui.locale,
      device: cookies.device ?? device,
    },
    server: {
      ...state.server,
      graphqlEndpoint,
    },
  }));

  // Configure Relay
  const relayNework = Network.create(relayFetch({ graphqlEndpoint }));
  const relayStore = new Store(new RecordSource());
  const relayEnvironment = new Environment({
    network: relayNework,
    store: relayStore,
    isServer: true,
  });

  let statusCode = 404;
  const preloadedStates: PreloadedStates = {
    RELAY: relayEnvironment.getStore().getSource().toJSON(),
    REDUX: reduxDefaultState.getInitialState(),
  };

  const isDesktop = device === 'desktop';
  const isBlog = String(url).match(/^\/blog(\/.*|)$/) !== null;

  // Fill Relay store by fetching request
  await fetchQuery<PageQuery>(relayEnvironment, query, {
    path: String(url),
    isDesktop,
    isBlog,
    firstPost: 10,
    afterPost: null,
  })
    .toPromise()
    .then(resp => {
      if (resp) {
        statusCode = resp?.pages.resolve.statusCode;
        preloadedStates.RELAY = relayEnvironment.getStore().getSource().toJSON();
      }

      return true;
    })
    .catch(err => {
      console.error('Unknown Error', err);
      statusCode = 500;
    });

  const preloadedStatesBase64 = Buffer.from(
    JSON.stringify({
      REDUX: preloadedStates.REDUX,
      RELAY: preloadedStates.RELAY,
    }),
  ).toString('base64');
  const webExtractor = new ChunkExtractor({
    statsFile: path.resolve(__dirname, './public/loadable-stats.json'),
    entrypoints: ['app'],
  });

  const handler = createStaticHandler(routes);
  const routerContext = await handler.query(new Request(`${host}${url}`));
  if (routerContext instanceof Response) {
    throw routerContext;
  }
  const router = createStaticRouter(routes, routerContext);

  // const helmetContext = {};

  // If «fetchQuery» was executed successfully, then we can render the
  // application without worrying about <Suspense />.
  // But if the request, for some reason, failed with an error (statusCode = 500),
  // we will have to render the <Fallback /> component, since in
  // this case «React» will fail with an error
  const htmlContent = renderToString(
    webExtractor.collectChunks(
      <React.StrictMode>
        <ErrorBoundary>
          {/* <HelmetProvider context={helmetContext}> */}
          <ReduxProvider>
            <RelayProvider storeRecords={preloadedStates.RELAY}>
              <CSSCacheProvider value={cssCache}>
                <StaticRouterProvider router={router} context={routerContext} nonce="the-nonce" />
              </CSSCacheProvider>
            </RelayProvider>
          </ReduxProvider>
          {/* </HelmetProvider> */}
        </ErrorBoundary>
      </React.StrictMode>,
    ),
  );
  // const { helmet } = helmetContext as HelmetFilledContext;
  const stylesChunks = extractCriticalToChunks(htmlContent);
  const styleTags = constructStyleTagsFromChunks(stylesChunks);

  const templateFilename = path.resolve(__dirname, './server/index.mustache');
  const templateContent = fs.readFileSync(templateFilename, {
    encoding: 'utf8',
  });

  const html = Mustache.render(templateContent, {
    // helmet: {
    //   title: helmet.title.toString(),
    //   base: helmet.base.toString(),
    //   meta: helmet.meta.toString(),
    //   link: helmet.link.toString(),
    //   script: helmet.script.toString(),
    //   noscript: helmet.noscript.toString(),
    //   style: helmet.style.toString(),
    //   htmlAttributes: helmet.htmlAttributes.toString(),
    //   bodyAttributes: helmet.bodyAttributes.toString(),
    // },
    preloadedStatesBase64,
    styleTags,
    extractor: {
      scriptTags: webExtractor.getScriptTags(),
      linkTags: webExtractor.getLinkTags(),
      styleTags: webExtractor.getStyleTags(),
    },
    htmlContent,
  });

  // Save already renderer HTML into the Redis cache
  if (redisCacheExp > 0) {
    const cacheData = JSON.stringify({
      ...cacheKeyPayload,
      statusCode,
      html,
    });
    await redis.set(`${REDIS_KEY_HTML_CACHE}${cacheKey}`, cacheData, 'EX', redisCacheExp);
  }

  return {
    stream: stream.Readable.from([html]),
    statusCode,
  };
};

const renderHTMLRoute = async (props: Props) => {
  const { req, res } = props;
  const { method, headers } = req;
  const acceptEncoding = String(headers?.['accept-encoding'] || '')
    .split(',')
    .map(value => value.trim());

  const { stream, statusCode } = await renderHTML(props);
  res.statusCode = statusCode;
  res.setHeader('content-type', 'text/html; charset=UTF-8');

  if (acceptEncoding.includes('gzip')) {
    res.setHeader('content-encoding', 'gzip');
    if (method === 'GET') {
      return stream.pipe(zlib.createGzip()).pipe(res);
    }

    return res.end();
  }

  if (method === 'GET') {
    return stream.pipe(res);
  }

  return res.end();
};

export default renderHTMLRoute;
