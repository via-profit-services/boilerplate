import * as React from 'react';

export interface State {
  readonly content?: React.ReactNode;
  readonly header?: string;
}
export interface Action {
  readonly type: 'set';
  readonly payload: Partial<State>;
}

export interface ContextType {
  readonly state: State;
  readonly dispatch: React.Dispatch<Action>;
}

export const initialState: State = {
  content: null,
  header: '',
};

export const Context = React.createContext<ContextType>({
  state: initialState,
  dispatch: () => null,
});

export const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'set': {
      const { header, content } = action.payload;
      const newState: State = {
        ...state,
        header: header,
        content: content,
      };

      return newState;
    }

    default:
      return state;
  }
};
