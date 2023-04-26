import React, { useReducer } from 'react';

import { reducer, Context, initialState } from './reducer';

interface WrapperProps {
  readonly children: React.ReactNode | React.ReactNode[];
}

const Wrapper: React.FC<WrapperProps> = props => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <>{children}</>
    </Context.Provider>
  );
};

export default React.memo(Wrapper);
