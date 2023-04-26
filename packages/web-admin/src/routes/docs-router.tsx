import React from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import loadable from '@loadable/component';

import LoadingIndicator from '~/components/LoadingIndicator';

const NotFound = loadable(() => import('~/containers/NotFound/index'));
const DocsComponentsButtons = loadable(() => import('~/containers/Docs/Components/Buttons/index'));
const DocsComponentsDialogs = loadable(() => import('~/containers/Docs/Components/Dialogs/index'));

export const docsRouter: RouteObject = {
  path: 'docs',
  caseSensitive: true,
  element: <Outlet />,
  children: [
    {
      path: 'components/buttons',
      caseSensitive: true,
      element: (
        <React.Suspense fallback={<LoadingIndicator />}>
          <DocsComponentsButtons />
        </React.Suspense>
      ),
    },
    {
      path: 'components/dialogs',
      caseSensitive: true,
      element: (
        <React.Suspense fallback={<LoadingIndicator />}>
          <DocsComponentsDialogs />
        </React.Suspense>
      ),
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default docsRouter;
