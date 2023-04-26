import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import reduxDefaultState from '../reduxDefaultState';

type State = ReduxStore['server'];

const server = createSlice({
  name: 'server',
  initialState: () => reduxDefaultState.getInitialState().server,
  reducers: {
    reset: () => reduxDefaultState.getDefaultState().server,
    graphqlEndpoint: (state, action: PayloadAction<State['graphqlEndpoint']>) => {
      state.graphqlEndpoint = action.payload;
    },
  },
});

export const serverActions = server.actions;

export default server;
