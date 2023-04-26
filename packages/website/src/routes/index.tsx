import React from 'react';
import { RouteObject } from 'react-router-dom';
import loadable from '@loadable/component';

const Page = loadable(() => import('~/containers/Page/index'));

export const routes: RouteObject[] = [
  {
    path: '/*',
    element: (
      <React.Suspense>
        <Page />
      </React.Suspense>
    ),
  },
];

export default routes;
