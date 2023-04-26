import React from 'react';
import { RouteObject, Outlet } from 'react-router-dom';
import loadable from '@loadable/component';

import LoadingIndicator from '~/components/LoadingIndicator';

const NotFound = loadable(() => import('~/containers/NotFound/index'));
const PagesList = loadable(() => import('~/containers/Pages/PagesList/index'));
const PagesEdit = loadable(() => import('~/containers/Pages/PagesEdit/index'));

export const pagesRouter: RouteObject = {
  path: 'pages',
  caseSensitive: true,
  element: <Outlet />,
  children: [
    {
      path: 'list',
      caseSensitive: true,
      element: (
        <React.Suspense fallback={<LoadingIndicator />}>
          <PagesList />
        </React.Suspense>
      ),
    },
    {
      path: 'list/:cursor',
      caseSensitive: true,
      element: (
        <React.Suspense fallback={<LoadingIndicator />}>
          <PagesList />
        </React.Suspense>
      ),
    },
    {
      path: 'edit/:id',
      caseSensitive: true,
      element: (
        <React.Suspense>
          <PagesEdit />
        </React.Suspense>
      ),
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default pagesRouter;
