import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import reduxDefaultState from '../reduxDefaultState';

type State = ReduxStore['pagesListVariables'];

const pagesListVariables = createSlice({
  name: 'pagesListVariables',
  initialState: () => reduxDefaultState.getInitialState().pagesListVariables,
  reducers: {
    reset: () => reduxDefaultState.getDefaultState().pagesListVariables,
    setPartial: (state, action: PayloadAction<Partial<State>>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const pagesListVariablesActions = pagesListVariables.actions;

export default pagesListVariables;
