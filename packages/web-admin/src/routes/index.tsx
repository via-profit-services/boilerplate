import React from 'react';
import { RouteObject } from 'react-router-dom';
import loadable from '@loadable/component';

import usersRouter from './users-router';
import pagesRouter from './pages-router';
import dashboardRouter from './dashboard-router';

const AdminPanelTemplate = loadable(() => import('~/templates/AdminPanelTemplate/index'));
const NotFound = loadable(() => import('~/containers/NotFound/index'));

export const routes: RouteObject[] = [
  {
    path: '/',
    caseSensitive: true,
    element: <AdminPanelTemplate />,
    children: [usersRouter, pagesRouter, dashboardRouter],
  },

  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
