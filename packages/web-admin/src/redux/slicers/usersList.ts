import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import reduxDefaultState from '../reduxDefaultState';

type State = ReduxStore['usersListVariables'];

const usersListVariables = createSlice({
  name: 'usersListVariables',
  initialState: () => reduxDefaultState.getInitialState().usersListVariables,
  reducers: {
    reset: () => reduxDefaultState.getDefaultState().usersListVariables,
    setPartial: (state, action: PayloadAction<Partial<State>>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const usersListVariablesActions = usersListVariables.actions;

export default usersListVariables;
