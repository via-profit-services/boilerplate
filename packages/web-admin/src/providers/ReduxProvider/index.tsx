import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import reducer from '~/redux/reducers';

export interface ReduxProviderProps {
  readonly children: React.ReactNode | readonly React.ReactNode[];
}

const ReduxProvider: React.FC<ReduxProviderProps> = props => {
  const { children } = props;
  const storeRef = React.useRef(configureStore({ reducer }));

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxProvider;
