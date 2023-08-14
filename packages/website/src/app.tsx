import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { CacheProvider as CSSCacheProvider } from '@emotion/react';
// import { HelmetProvider } from 'react-helmet-async';
import createCache from '@emotion/cache';

import routes from '~/routes';
import readPreloadedState from '~/utils/readPreloadedState';
import ReduxProvider from '~/providers/ReduxProvider';
import RelayProvider from '~/providers/RelayProvider';
import ErrorBoundary from '@via-profit/ui-kit/ErrorBoundary';
import reduxDefaultState from '~/redux/reduxDefaultState';

const bootstrap = async () => {
  const rootElement = document.getElementById('app');
  if (!rootElement) {
    throw new Error('Root element with id #app not found');
  }
  const cssCache = createCache({ key: 'app' });
  const preloadedStates = readPreloadedState();

  reduxDefaultState.setInitialState(state => ({
    ui: {
      ...state.ui,
      ...preloadedStates?.REDUX?.ui,
    },
    server: {
      ...state.server,
      ...preloadedStates?.REDUX?.server,
    },
  }));

  const router = createBrowserRouter(routes);

  const AppData = (
    <ErrorBoundary>
      {/* <HelmetProvider> */}
      <ReduxProvider>
        <RelayProvider storeRecords={preloadedStates?.RELAY}>
          <CSSCacheProvider value={cssCache}>
            <RouterProvider router={router} />
          </CSSCacheProvider>
        </RelayProvider>
      </ReduxProvider>
      {/* </HelmetProvider> */}
    </ErrorBoundary>
  );

  await loadableReady();

  if (process.env.NODE_ENV !== 'development') {
    hydrateRoot(rootElement, AppData);
  }

  if (process.env.NODE_ENV === 'development') {
    const root = createRoot(rootElement);
    root.render(AppData);
  }
};

bootstrap();
