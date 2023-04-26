import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import reduxDefaultState from '~/redux/reduxDefaultState';
import { LOCAL_STORAGE_AUTHORIZATION_KEY } from '~/utils/constants';

type State = ReduxStore['auth'];

const auth = createSlice({
  name: 'auth',
  initialState: () => reduxDefaultState.getInitialState().auth,
  reducers: {
    reset: () => {
      Cookies.remove('Authorization');

      localStorage.clear();

      return reduxDefaultState.getDefaultState().auth;
    },
    auth: (state, action: PayloadAction<State>) => {
      const { payload } = action;
      if (payload === null) {
        state.accessToken = null;
        state.refreshToken = null;
      }

      if (payload !== null) {
        state.accessToken =
          payload.accessToken === null
            ? null
            : {
                ...payload.accessToken,
                payload: {
                  ...payload.accessToken.payload,
                  roles: [...(payload.accessToken.payload.roles || [])],
                },
              };
        state.refreshToken = payload.refreshToken;
      }

      if (payload.accessToken) {
        const authRecord = localStorage.getItem(LOCAL_STORAGE_AUTHORIZATION_KEY);
        let refreshToken = '';

        if (authRecord) {
          try {
            const auth = JSON.parse(authRecord);
            refreshToken = auth?.refreshToken || '';
          } catch (err) {
            throw new Error('Failed to read access token from local storage');
          }
        }

        localStorage.setItem(
          LOCAL_STORAGE_AUTHORIZATION_KEY,
          JSON.stringify({ accessToken: payload.accessToken, refreshToken }),
        );

        Cookies.set('Authorization', `Bearer ${payload.accessToken?.token}`, {
          path: '/',
          expires: new Date(payload.accessToken.payload.exp * 1000),
          secure: true,
        });
        // Cookies.set('AccessToken', JSON.stringify(payload.accessToken), {
        //   path: '/',
        //   expires: new Date(payload.accessToken.payload.exp * 1000),
        //   secure: true,
        // });
      } else {
        Cookies.remove('Authorization');
      }

      if (payload.refreshToken) {
        const authRecord = localStorage.getItem(LOCAL_STORAGE_AUTHORIZATION_KEY);
        let accessToken = '';

        if (authRecord) {
          try {
            const auth = JSON.parse(authRecord);
            accessToken = auth?.accessToken || '';
          } catch (err) {
            console.error(err);
            throw new Error('Failed to read access token from local storage');
          }
        }
        localStorage.setItem(
          LOCAL_STORAGE_AUTHORIZATION_KEY,
          JSON.stringify({ refreshToken: payload.refreshToken, accessToken }),
        );

        // Cookies.set('RefreshToken', JSON.stringify(payload.refreshToken), {
        //   path: '/',
        //   expires: new Date(payload.refreshToken.payload.exp * 1000),
        //   secure: true,
        // });
      } else {
        Cookies.remove('RefreshToken');
      }
    },
  },
});

export const authActions = auth.actions;

export default auth;
