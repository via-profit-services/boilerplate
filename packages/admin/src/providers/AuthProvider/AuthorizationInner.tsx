import * as React from 'react';
import { graphql, useMutation } from 'react-relay';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import SignInTemplate from '~/templates/SignInTemplate';
// import AuthentificationForm from './AuthentificationForm';
import LoadingIndicator from '~/components/LoadingIndicator';
import refreshTokenSpec, {
  AuthorizationInnerRefreshTokenMutation,
} from '~/relay/artifacts/AuthorizationInnerRefreshTokenMutation.graphql';
import { authActions } from '~/redux/slicers/auth';
import ThemeProvider from '~/providers/ThemeProvider';

export enum AuthState {
  CHECKING = 'checking',
  FAILED = 'failed',
  SUCCESS = 'success',
}

export interface AuthorizationInnerProps {
  children: React.ReactNode | React.ReactNode[];
}

const formatTime = (ms: number) => {
  const seconds = (ms / 1000).toFixed(1);
  const minutes = (ms / (1000 * 60)).toFixed(1);
  const hours = (ms / (1000 * 60 * 60)).toFixed(1);
  const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);

  switch (true) {
    case Number(seconds) < 60:
      return `${seconds} sec.`;
    case Number(minutes) < 60:
      return `${minutes} min.`;
    case Number(hours) < 24:
      return `${hours} hrs.`;
    default:
      return `${days} days`;
  }
};

const selector = createStructuredSelector({
  accessToken: (store: ReduxStore) => store.auth.accessToken,
  refreshToken: (store: ReduxStore) => store.auth.refreshToken,
});

const AuthorizationInner: React.FC<AuthorizationInnerProps> = props => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector(selector);
  const refreshTimeoutHandle = React.useRef<NodeJS.Timeout | null>(null);
  const [authState, setAuthState] = React.useState<AuthState>(AuthState.CHECKING);
  const { children } = props;
  const [refreshTokenMutation] =
    useMutation<AuthorizationInnerRefreshTokenMutation>(refreshTokenSpec);

  const commitRefresh = React.useCallback(() => {
    if (!refreshToken) {
      console.debug('[Authorization] Refresh token is missing. Aborting');

      return;
    }
    refreshTokenMutation({
      variables: {
        refreshToken: refreshToken?.token || '',
      },
      onError: err => {
        console.debug('[Authorization] Refresh token error. Logout');
        console.error(err);

        dispatch(authActions.reset());
        setAuthState(AuthState.FAILED);
      },
      updater: store => {
        store.invalidateStore();
      },
      onCompleted: refreshResponse => {
        const { refresh } = refreshResponse.authentification;
        if (refresh.__typename === 'TokenRegistrationError') {
          console.debug('[Authorization] Failed to refresh token. Logout');
          if (refreshTimeoutHandle.current) {
            clearTimeout(refreshTimeoutHandle.current);
          }
          dispatch(authActions.reset());
          setAuthState(AuthState.FAILED);
        }

        if (refresh.__typename === 'TokenRegistrationSuccess') {
          dispatch(
            authActions.auth({
              accessToken: refresh.payload.accessToken,
              refreshToken: refresh.payload.refreshToken,
            }),
          );
        }
      },
    });
  }, [dispatch, refreshToken, refreshTokenMutation]);

  /**
   * Refresh token action
   */
  const refreshTokenAction = React.useCallback(() => {
    if (refreshTimeoutHandle.current) {
      clearTimeout(refreshTimeoutHandle.current);
    }

    const refreshTokenExpLeft = (refreshToken?.payload?.exp || 0) * 1000 - Date.now();
    // If the token expires in less than 2 seconds
    // then break the operation
    if (refreshTokenExpLeft < 2000) {
      console.debug('[Authorization] Refresh token expired');
      if (refreshTimeoutHandle.current) {
        clearTimeout(refreshTimeoutHandle.current);
      }
      dispatch(authActions.reset());
      setAuthState(AuthState.FAILED);

      return;
    }

    const refreshTimeout = (accessToken?.payload?.exp || 0) * 1000 - new Date().getTime();
    refreshTimeoutHandle.current = setTimeout(async () => {
      commitRefresh();
    }, Math.max(refreshTimeout - 2000, 0));
  }, [refreshToken?.payload?.exp, accessToken?.payload?.exp, dispatch, commitRefresh]);

  /**
   * First start action
   */
  React.useEffect(() => {
    if (refreshTimeoutHandle.current) {
      clearTimeout(refreshTimeoutHandle.current);
    }

    // If tokens are missing
    // Then go to sign in form
    if (!accessToken && !refreshToken) {
      console.debug('[Authorization] Authorization is missing');
      dispatch(authActions.reset());
      setAuthState(AuthState.FAILED);

      return;
    }

    // If refresh token expired
    // Then go to sign in form
    if ((refreshToken?.payload?.exp || 0) * 1000 < new Date().getTime()) {
      console.debug('[Authorization] Refresh token expired');
      dispatch(authActions.reset());
      setAuthState(AuthState.FAILED);

      return;
    }

    // If Access token alive
    // Then set timer to refreshing
    if ((accessToken?.payload?.exp || 0) * 1000 > new Date().getTime() - 2000) {
      const refreshTimeout = (accessToken?.payload?.exp || 0) * 1000 - new Date().getTime() - 2000;
      console.debug(`[Authorization] Next token refresh after ${formatTime(refreshTimeout)}`);
      refreshTimeoutHandle.current = setTimeout(() => {
        refreshTokenAction();
      }, refreshTimeout);

      setAuthState(AuthState.SUCCESS);

      return;
    }

    // If Access token is expired
    // Then try refreshing right now
    if ((accessToken?.payload?.exp || 0) * 1000 < new Date().getTime()) {
      console.debug('[Authorization] Refresh token right now');
      refreshTokenAction();

      return;
    }
  }, [accessToken, dispatch, refreshToken, refreshTokenAction]);

  // Just componentWillUnmount
  React.useEffect(
    () => () => {
      if (refreshTimeoutHandle.current) {
        clearTimeout(refreshTimeoutHandle.current);
      }
    },
    [],
  );

  // render
  switch (authState) {
    case AuthState.SUCCESS:
      return <>{children}</>;

    case AuthState.FAILED:
      return <SignInTemplate />;

    case AuthState.CHECKING:
    default:
      return (
        <ThemeProvider>
          <LoadingIndicator />
        </ThemeProvider>
      );
  }
};

export default AuthorizationInner;

graphql`
  mutation AuthorizationInnerRefreshTokenMutation($refreshToken: String!) {
    authentification {
      refresh(refreshToken: $refreshToken) {
        __typename
        ... on TokenRegistrationError {
          name
          msg
        }
        ... on TokenRegistrationSuccess {
          payload {
            accessToken {
              token
              payload {
                id
                uuid
                exp
                iss
                roles
                type
              }
            }
            refreshToken {
              token
              payload {
                id
                exp
                iss
                type
                uuid
              }
            }
          }
        }
      }
    }
  }
`;

graphql`
  subscription AuthorizationInnerUserUpdatedSubscription {
    userWasUpdated {
      id
    }
  }
`;
