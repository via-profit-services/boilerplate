const defaultState: Readonly<ReduxStore> = {
  ui: {
    theme: 'standardLight',
    fontSize: 'normal',
    locale: 'ru-RU',
  },
  server: {
    graphqlEndpoint: null,
    subscriptionEndpoint: null,
  },
  auth: {
    accessToken: null,
    refreshToken: null,
  },
  usersListVariables: {
    first: 30,
    after: null,
    before: null,
    last: null,
    orderBy: null,
    search: null,
  },
  pagesListVariables: {
    first: 300,
    after: null,
    before: null,
    last: null,
    orderBy: null,
    search: null,
  },
};

const storeRef: Mutable<{ currentState: ReduxStore }> = {
  currentState: defaultState,
};

export const reduxDefaultState = {
  /**
   * Returns Default state. Not initial
   */
  getDefaultState: () => defaultState,

  /**
   * Returns initial state
   */
  getInitialState: () => storeRef.currentState,

  /**
   * Mutate initial state
   */
  setInitialState: (cb: (state: ReduxStore) => ReduxStore): ReduxStore => {
    const newState = cb(storeRef.currentState);

    storeRef.currentState = newState;

    return newState;
  },
};

export default reduxDefaultState;
