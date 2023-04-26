import { combineReducers } from '@reduxjs/toolkit';

import ui from './slicers/ui';
import server from './slicers/server';
import auth from './slicers/auth';
import usersListVariables from './slicers/usersList';
import pagesListVariables from './slicers/pagesList';

const reducer = combineReducers({
  ui: ui.reducer,
  server: server.reducer,
  auth: auth.reducer,
  usersListVariables: usersListVariables.reducer,
  pagesListVariables: pagesListVariables.reducer,
});

export default reducer;
