/* eslint-disable import/max-dependencies */
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';
import stream from 'node:stream';
import Mustache from 'mustache';
import React from 'react';
import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { CacheProvider as CSSCacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import RelayProvider from '~/providers/RelayProvider';
import ReduxProvider from '~/providers/ReduxProvider';
import { Network, Store, RecordSource, Environment } from 'relay-runtime';
import dotenv from 'dotenv';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';

import ErrorBoundary from '@via-profit/ui-kit/ErrorBoundary';
import AuthProvider from '~/providers/AuthProvider/AuthorizationInner';
import reduxDefaultState from '~/redux/reduxDefaultState';
import relayFetch from '~/server/utils/relay-fetch';
import routes from '~/routes';

interface Props extends AppConfigProduction {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
}

type RenderHTMLPayload = {
  stream: stream.Readable;
  statusCode: number;
};

dotenv.config();

const renderHTML = async (props: Props): Promise<RenderHTMLPayload> => {
  const { req, graphqlEndpoint, subscriptionEndpoint } = props;
  const { headers, url } = req;
  const host = `http://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`;

  // Configure Relay
  const relayNework = Network.create(relayFetch({ graphqlEndpoint, subscriptionEndpoint }));
  const relayStore = new Store(new RecordSource());
  const relayEnvironment = new Environment({
    network: relayNework,
    store: relayStore,
    isServer: true,
  });

  // Parsing cookies
  const cookies: {
    theme?: unknown;
    locale?: unknown;
    fontSize?: unknown;
    [key: string]: unknown;
  } = {};
  String(headers.cookie)
    .split(';')
    .forEach(pair => {
      const index = pair.indexOf('=');
      if (index > -1) {
        const key = pair.substring(0, index).trim();

        let value = pair.substring(index + 1, pair.length).trim();
        if (value[0] === '"') {
          value = value.slice(1, -1);
        }
        cookies[key] = decodeURIComponent(value);
      }
    });

  const preloadedStates: PreloadedStates = {
    RELAY: relayEnvironment.getStore().getSource().toJSON(),
    REDUX: reduxDefaultState.getInitialState(),
  };

  const cssCache = createCache({ key: 'app' });
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cssCache);
  const preloadedStatesBase64 = Buffer.from(JSON.stringify(preloadedStates)).toString('base64');
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

  const htmlContent = renderToString(
    webExtractor.collectChunks(
      <CSSCacheProvider value={cssCache}>
        <ErrorBoundary>
          <ReduxProvider>
            <RelayProvider storeRecords={preloadedStates.RELAY}>
              <AuthProvider>
                <StaticRouterProvider router={router} context={routerContext} nonce="the-nonce" />
              </AuthProvider>
            </RelayProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </CSSCacheProvider>,
    ),
  );
  const helmet = Helmet.renderStatic();
  const stylesChunks = extractCriticalToChunks(htmlContent);
  const styleTags = constructStyleTagsFromChunks(stylesChunks);
  const templateFilename = path.resolve(__dirname, './server/index.mustache');
  const templateContent = fs.readFileSync(templateFilename, {
    encoding: 'utf8',
  });

  const html = Mustache.render(templateContent, {
    helmet: {
      title: helmet.title.toString(),
      base: helmet.base.toString(),
      meta: helmet.meta.toString(),
      link: helmet.link.toString(),
      script: helmet.script.toString(),
      noscript: helmet.noscript.toString(),
      style: helmet.style.toString(),
      htmlAttributes: helmet.htmlAttributes.toString(),
      bodyAttributes: helmet.bodyAttributes.toString(),
    },
    preloadedStatesBase64,
    styleTags,
    extractor: {
      scriptTags: webExtractor.getScriptTags(),
      linkTags: webExtractor.getLinkTags(),
      styleTags: webExtractor.getStyleTags(),
    },
    htmlContent,
  });

  return {
    stream: stream.Readable.from([html]),
    statusCode: 200,
  };
};

export default renderHTML;
