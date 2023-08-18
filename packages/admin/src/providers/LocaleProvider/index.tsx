import React from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ruRU from '~/translations/ru-RU.json';

export interface LocaleProviderProps {
  readonly children: React.ReactNode | readonly React.ReactNode[];
}

const selector = createStructuredSelector({
  currentLocale: (store: ReduxStore) => store.ui.locale,
});

const LocaleProvider: React.FC<LocaleProviderProps> = props => {
  const { children } = props;
  const { currentLocale } = useSelector(selector);
  const { locale, messages } = React.useMemo(() => {
    switch (currentLocale) {
      case 'ru-RU':
      default:
        return {
          locale: currentLocale,
          messages: ruRU,
        };
    }
  }, [currentLocale]);

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default LocaleProvider;
