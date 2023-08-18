import React from 'react';
import { RouteObject, Outlet } from 'react-router-dom';
import loadable from '@loadable/component';

import LoadingIndicator from '~/components/LoadingIndicator';

const NotFound = loadable(() => import('~/containers/NotFound/index'));
const ClientsList = loadable(() => import('~/containers/Clients/ClientsList/index'));
const ClientEdit = loadable(() => import('~/containers/Clients/ClientEdit/index'));

export const clientsRouter: RouteObject = {
  path: 'clients',
  caseSensitive: true,
  element: <Outlet />,
  children: [
    {
      path: 'list/:preset',
      caseSensitive: true,
      element: (
        <React.Suspense fallback={<LoadingIndicator />}>
          <ClientsList />
        </React.Suspense>
      ),
    },
    {
      path: ':id/edit',
      caseSensitive: true,
      element: (
        <React.Suspense fallback={<LoadingIndicator />}>
          <ClientEdit />
        </React.Suspense>
      ),
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default clientsRouter;
