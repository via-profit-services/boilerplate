import React from 'react';
import { IntlProvider } from 'react-intl';
import ThemeProvider, { createTheme } from '@via-profit/ui-kit/ThemeProvider';

import AuthorizationInner from './AuthorizationInner';
import ru from '~/translations/ru-RU.json';
import standardLight from '~/themes/standardLight';

export interface AuthorizationProviderProps {
  readonly children: React.ReactNode | React.ReactNode[];
}

const AuthorizationProvider: React.FC<AuthorizationProviderProps> = props => {
  const { children } = props;
  const theme = React.useMemo(() => createTheme(standardLight), []);

  return (
    <ThemeProvider theme={theme}>
      <IntlProvider locale="ru" messages={ru} onError={() => undefined}>
        <AuthorizationInner>{children}</AuthorizationInner>
      </IntlProvider>
    </ThemeProvider>
  );
};

export default AuthorizationProvider;
