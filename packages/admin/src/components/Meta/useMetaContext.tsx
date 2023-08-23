import React from 'react';

export type MetaState = {
  readonly title: string;
};

export type MetaContext = {
  readonly state: MetaState;
  readonly dispatch: React.Dispatch<Action>;
};

export type Action = ActionSetPartial;

export type ActionSetPartial = {
  readonly type: 'setPartial';
  readonly payload: Partial<MetaState>;
};

export const actionSetPartial = (data: ActionSetPartial['payload']): ActionSetPartial => ({
  type: 'setPartial',
  payload: data,
});

const reducer: React.Reducer<MetaState, Action> = (state, action) => {
  switch (action.type) {
    case 'setPartial':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export const metaDefaultState: MetaState = {
  title: '',
};

const metaContext = React.createContext<MetaContext>({
  state: metaDefaultState,
  dispatch: () => undefined,
});

interface MetaContextProviderProps {
  readonly children: React.ReactNode | readonly React.ReactNode[];
}

export const MetaContextProvider: React.FC<MetaContextProviderProps> = props => {
  const [state, dispatch] = React.useReducer(reducer, metaDefaultState);
  const { children } = props;

  return <metaContext.Provider value={{ state, dispatch }}>{children}</metaContext.Provider>;
};

export const useMetaContext = () => {
  const { state, dispatch } = React.useContext(metaContext);

  return {
    state: React.useMemo(() => state, [state]),
    dispatch: React.useMemo(() => dispatch, [dispatch]),
  };
};
