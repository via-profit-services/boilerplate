import { LOCAL_STORAGE_AUTHORIZATION_KEY } from '~/utils/constants';

const cache: { preloadedStates: Partial<PreloadedStates> | undefined } = {
  preloadedStates: undefined,
};

const readPreloadedState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (typeof cache.preloadedStates !== 'undefined') {
    return cache.preloadedStates;
  }

  const statesStr: string = (window as any).__PRELOADED_STATES__ || '';
  delete (window as any).__PRELOADED_STATES__;
  let preloadedStates: Partial<PreloadedStates> | undefined;
  try {
    preloadedStates = JSON.parse(
      decodeURIComponent(
        window
          .atob(statesStr)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      ),
    ) as Partial<PreloadedStates>;
  } catch (err) {
    console.error('Failed to parse preloaded state');
    console.error(err);
  }

  cache.preloadedStates = {
    REDUX: preloadedStates?.REDUX,
    RELAY: preloadedStates?.RELAY,
  };

  // if (process.env.NODE_ENV === 'development') {
  try {
    const plainAuth = localStorage.getItem(LOCAL_STORAGE_AUTHORIZATION_KEY);
    const auth: ReduxStore['auth'] | null = plainAuth ? JSON.parse(plainAuth) : null;

    cache.preloadedStates = {
      REDUX: {
        ...preloadedStates?.REDUX,
        auth: {
          accessToken: auth?.accessToken ?? null,
          refreshToken: auth?.refreshToken ?? null,
        },
      },
      RELAY: preloadedStates?.RELAY,
    };
  } catch (err) {
    console.error(err);
  }

  return cache.preloadedStates;
};

export default readPreloadedState;
