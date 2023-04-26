import React from 'react';
import { RouteObject } from 'react-router-dom';
import loadable from '@loadable/component';

const NotFound = loadable(() => import('~/containers/NotFound/index'));
const Dashboard = loadable(() => import('~/containers/Dashboard/index'));

const dashboardRouter: RouteObject = {
  path: 'dashboard',
  caseSensitive: true,
  element: (
    <React.Suspense>
      <Dashboard />
    </React.Suspense>
  ),
  children: [
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default dashboardRouter;
