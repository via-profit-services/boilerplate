import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookie, { CookieAttributes } from 'js-cookie';

import reduxDefaultState from '../reduxDefaultState';

type State = ReduxStore['ui'];

const cookieOptions: CookieAttributes = {
  expires: 365,
  path: '/',
  secure: process.env.NODE_ENV !== 'development',
};

const ui = createSlice({
  name: 'ui',
  initialState: () => reduxDefaultState.getInitialState().ui,
  reducers: {
    reset: () => {
      Cookie.remove('theme');
      Cookie.remove('fontSize');
      Cookie.remove('locale');
      Cookie.remove('device');

      return reduxDefaultState.getDefaultState().ui;
    },
    theme: (state, action: PayloadAction<State['theme']>) => {
      state.theme = action.payload;
      Cookie.set('theme', state.theme, cookieOptions);
    },
    fontSize: (state, action: PayloadAction<State['fontSize']>) => {
      state.fontSize = action.payload;
      Cookie.set('fontSize', state.fontSize, cookieOptions);
    },
    locale: (state, action: PayloadAction<State['locale']>) => {
      state.locale = action.payload;
      Cookie.set('locale', state.locale, cookieOptions);
    },
  },
});

export const uiActions = ui.actions;

export default ui;
