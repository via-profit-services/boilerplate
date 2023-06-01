import * as React from 'react';
import styled from '@emotion/styled';
import ThemeProvider, { Theme } from '@boilerplate/ui-kit/src/ThemeProvider';
import { Outlet } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { graphql, useLazyLoadQuery } from 'react-relay';
import 'react-toastify/dist/ReactToastify.css';

import Header from '~/components/Header';
import MetaWrapper from '~/components/Meta/Wrapper';
import Sidebar from '~/components/Sidebar';
import translationsruRU from '~/translations/ru-RU.json';
import themeStandardLight from '~/themes/standardLight';
import themeStandardDark from '~/themes/standardDark';
import GlobalStyles from '~/templates/AdminPanelTemplate/GlobalStyles';
import query, { AdminPanelTemplateQuery } from '~/relay/artifacts/AdminPanelTemplateQuery.graphql';

graphql`
  query AdminPanelTemplateQuery {
    ...PersonBlockFragment
  }
`;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;

const Main = styled.div`
  flex: 1;
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  height: calc(-3rem + 100vh);
  top: 3rem;
  position: relative;
`;

const localeMap: Record<LocaleName, Record<string, string>> = {
  'ru-RU': translationsruRU,
};

const themesMap: Record<ThemeName, Theme> = {
  standardLight: themeStandardLight,
  standardDark: themeStandardDark,
};

const selector = createSelector(
  (store: ReduxStore) => store.ui.fontSize,
  (store: ReduxStore) => store.ui.locale,
  (store: ReduxStore) => store.ui.theme,
  (fontSize, locale, theme) => ({ fontSize, locale, theme }),
);

const AdminPanelTemplate: React.FC = () => {
  useLazyLoadQuery<AdminPanelTemplateQuery>(query, {});
  const state = useSelector(selector);
  const messages = localeMap[state.locale] || localeMap['ru-RU'];
  const locale = state.locale in localeMap ? state.locale : 'ru-RU';
  const theme = React.useMemo(
    () => themesMap[state.theme] || themesMap.standardLight,
    [state.theme],
  );

  return (
    <>
      <IntlProvider locale={locale} messages={messages}>
        <Helmet defaultTitle=" ">
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <ThemeProvider theme={theme}>
          <GlobalStyles fontSize={state.fontSize} />
          <MetaWrapper>
            <Wrapper>
              <Sidebar />
              <Main>
                <Header />
                <Content>
                  <Outlet />
                </Content>
              </Main>
            </Wrapper>
          </MetaWrapper>
          <ToastContainer />
        </ThemeProvider>
      </IntlProvider>
    </>
  );
};

export default AdminPanelTemplate;
