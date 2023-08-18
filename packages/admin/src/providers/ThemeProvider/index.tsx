import React from 'react';
import createTheme from '@via-profit/ui-kit/ThemeProvider/createTheme';
import Provider from '@via-profit/ui-kit/ThemeProvider';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import standardLight from '~/themes/standardLight';
import standardDark from '~/themes/standardDark';

const selector = createStructuredSelector({
  themeName: (store: ReduxStore) => store.ui.theme,
});

export interface ThemeProviderProps {
  readonly children: React.ReactNode | readonly React.ReactNode[];
}

const ThemeProvider: React.FC<ThemeProviderProps> = props => {
  const { children } = props;
  const { themeName } = useSelector(selector);

  const theme = React.useMemo(() => {
    switch (themeName) {
      case 'standardDark':
        return createTheme(standardDark);

      case 'standardLight':
      default:
        return createTheme(standardLight);
    }
  }, [themeName]);

  return <Provider theme={theme}>{children}</Provider>;
};

export default ThemeProvider;
