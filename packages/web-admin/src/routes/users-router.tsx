import React from 'react';
import { RouteObject, Outlet } from 'react-router-dom';
import loadable from '@loadable/component';

import LoadingIndicator from '~/components/LoadingIndicator';

const NotFound = loadable(() => import('~/containers/NotFound/index'));
const UsersList = loadable(() => import('~/containers/Users/UsersList/index'));
const UserEdit = loadable(() => import('~/containers/Users/UserEdit/index'));

export const usersRouter: RouteObject = {
  path: 'users',
  caseSensitive: true,
  element: <Outlet />,
  children: [
    {
      path: 'list',
      caseSensitive: true,
      element: (
        <React.Suspense fallback={<LoadingIndicator />}>
          <UsersList />
        </React.Suspense>
      ),
    },
    {
      path: 'edit-user/:id',
      element: (
        <React.Suspense fallback={<LoadingIndicator />}>
          <UserEdit />
        </React.Suspense>
      ),
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default usersRouter;
