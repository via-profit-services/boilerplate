import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { loadableReady } from '@loadable/component';
import { CacheProvider as CSSCacheProvider } from '@emotion/react';
import createCSSCache from '@emotion/cache';
import ReactModal from 'react-modal';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import routes from '~/routes';
import AuthProvider from '~/providers/AuthProvider';
import RelayProvider from '~/providers/RelayProvider';
import ReduxProvider from '~/providers/ReduxProvider';
import readPreloadedState from '~/utils/readPreloadedState';
import ErrorBoundary from '~/components/ErrorBoundary';
import reduxDefaultState from '~/redux/reduxDefaultState';

const bootstrap = async () => {
  const rootElement = document.getElementById('app');
  if (!rootElement) {
    throw new Error('React root element with id #app does not found');
  }

  // try to parse cookies
  const preloadedStates = readPreloadedState();
  const cssCache = createCSSCache({ key: 'app' });

  reduxDefaultState.setInitialState(state => ({
    ...state,
    auth: {
      ...state.auth,
      ...preloadedStates?.REDUX?.auth,
    },
    ui: {
      ...state.ui,
      ...preloadedStates?.REDUX?.ui,
    },
    server: {
      ...state.server,
      ...preloadedStates?.REDUX?.server,
    },
  }));

  ReactModal.setAppElement(rootElement);
  ReactModal.defaultStyles = { overlay: {}, content: {} };

  const router = createBrowserRouter(routes);

  const AppData = (
    <CSSCacheProvider value={cssCache}>
      <ErrorBoundary>
        <ReduxProvider>
          <RelayProvider storeRecords={preloadedStates?.RELAY}>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </RelayProvider>
        </ReduxProvider>
      </ErrorBoundary>
    </CSSCacheProvider>
  );

  await loadableReady();

  if (process.env.NODE_ENV === 'development') {
    const root = createRoot(rootElement);
    root.render(AppData);

    return;
  }

  if (process.env.NODE_ENV !== 'development') {
    hydrateRoot(rootElement, AppData);
  }
};

bootstrap();
