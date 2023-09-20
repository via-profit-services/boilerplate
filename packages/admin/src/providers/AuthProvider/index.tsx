import React from 'react';

import AuthorizationInner from '~/providers/AuthProvider/AuthorizationInner';

export interface AuthorizationProviderProps {
  readonly children: React.ReactNode | React.ReactNode[];
}

const AuthorizationProvider: React.FC<AuthorizationProviderProps> = props => {
  const { children } = props;

  return <AuthorizationInner>{children}</AuthorizationInner>;
};

export default AuthorizationProvider;
