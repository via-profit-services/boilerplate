import React from 'react';

import type { ClientsListQuery$variables } from '~/relay/artifacts/ClientsListQuery.graphql';

export type State = {
  readonly editClientID: string | null;
  readonly listOuterRef: HTMLDivElement | null;
  readonly variables: ClientsListQuery$variables;
};

const defaultState: State = {
  editClientID: null,
  listOuterRef: null,
  variables: {
    first: 100,
    after: null,
    before: null,
    last: null,
  },
};

type ActionSetEditClientID = {
  readonly type: 'editClientID';
  readonly payload: string | null;
};

type ActionSetListRef = {
  readonly type: 'listOuterRef';
  readonly payload: State['listOuterRef'];
};

type ActionSetVariables = {
  readonly type: 'variables';
  readonly payload: State['variables'];
};

type ActionResetVariables = {
  readonly type: 'resetVariables';
};

type Action = ActionSetEditClientID | ActionSetListRef | ActionSetVariables | ActionResetVariables;

export const actionSetEditClientID = (id: string | null): ActionSetEditClientID => ({
  type: 'editClientID',
  payload: id,
});

export const actionSetListOuterRef = (ref: State['listOuterRef']): ActionSetListRef => ({
  type: 'listOuterRef',
  payload: ref,
});

export const actionSetVariables = (vars: State['variables']): ActionSetVariables => ({
  type: 'variables',
  payload: vars,
});

export const actionResetVariables = (): ActionResetVariables => ({
  type: 'resetVariables',
});

type Context = {
  readonly state: State;
  readonly dispatch: React.Dispatch<Action>;
};

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'editClientID':
      return {
        ...state,
        editClientID: action.payload,
      };

    case 'listOuterRef':
      return {
        ...state,
        listOuterRef: action.payload,
      };
    case 'variables':
      return {
        ...state,
        variables: {
          ...state.variables,
          ...action.payload,
        },
      };
    case 'resetVariables':
      return {
        ...state,
        variables: {
          ...defaultState.variables,
        },
      };
    default:
      return {
        ...state,
      };
  }
};

interface ContextProviderProps {
  readonly children: React.ReactNode | readonly React.ReactNode[];
}

const context = React.createContext<Context>({
  state: defaultState,
  dispatch: () => undefined,
});

export const ContextProvider: React.FC<ContextProviderProps> = props => {
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  const { children } = props;

  return <context.Provider value={{ state, dispatch }}>{children}</context.Provider>;
};

export const useContext = () => {
  const { state, dispatch } = React.useContext(context);

  return {
    state,
    dispatch,
  };
};

export default useContext;
