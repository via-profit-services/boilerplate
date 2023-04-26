import { combineReducers } from '@reduxjs/toolkit';

import ui from './slicers/ui';
import server from './slicers/server';

const reducer = combineReducers({
  ui: ui.reducer,
  server: server.reducer,
});

export default reducer;
