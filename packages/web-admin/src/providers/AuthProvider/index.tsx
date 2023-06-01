import React from 'react';
import { IntlProvider } from 'react-intl';
import ThemeProvider from '@boilerplate/ui-kit/src/ThemeProvider';

import AuthorizationInner from './AuthorizationInner';
import ru from '~/translations/ru-RU.json';

export interface AuthorizationProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const AuthorizationProvider: React.FC<AuthorizationProviderProps> = props => {
  const { children } = props;

  return (
    <>
      <ThemeProvider>
        <IntlProvider locale="ru" messages={ru} onError={() => undefined}>
          <AuthorizationInner>{children}</AuthorizationInner>
        </IntlProvider>
      </ThemeProvider>
    </>
  );
};

export default AuthorizationProvider;
