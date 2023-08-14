/* eslint-disable import/max-dependencies */
import React from 'react';
import { useLazyLoadQuery, graphql } from 'react-relay';
import loadable from '@loadable/component';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useLocation } from 'react-router-dom';
import ThemeProvider, { UIThemeOverrides, createTheme } from '@via-profit/ui-kit/ThemeProvider';

import query, { PageQuery } from '~/relay/artifacts/PageQuery.graphql';
import LoadingIndicator from '~/components/LoadingIndicator';
import translationsruRU from '~/translations/ru-RU.json';
import themeStandardLight from '~/themes/standardLight';
import themeStandardDark from '~/themes/standardDark';
import GlobalStyles from '~/containers/Page/GlobalStyles';

import '~/assets/robots.txt';

const TemplateHomeDesktop = loadable(() => import('~/templates/TemplateHomeDesktop/index'), {
  fallback: <LoadingIndicator />,
});

const TemplateHomeMobile = loadable(() => import('~/templates/TemplateHomeMobile/index'), {
  fallback: <LoadingIndicator />,
});

const TemplateSecondDesktop = loadable(() => import('~/templates/TemplateSecondDesktop/index'), {
  fallback: <LoadingIndicator />,
});

const TemplateBlogPostDesktop = loadable(
  () => import('~/templates/TemplateBlogPostDesktop/index'),
  {
    fallback: <LoadingIndicator />,
  },
);

const TemplateBlogDesktop = loadable(() => import('~/templates/TemplateBlogDesktop/index'), {
  fallback: <LoadingIndicator />,
});

const TemplateFallbackDesktop = loadable(
  () => import('~/templates/TemplateFallbackDesktop/index'),
  {
    fallback: <LoadingIndicator />,
  },
);

const localeMap: Record<ReduxStore['ui']['locale'], Record<string, string>> = {
  'ru-RU': translationsruRU,
};

const themesMap: Record<ReduxStore['ui']['theme'], UIThemeOverrides> = {
  standardLight: themeStandardLight,
  standardDark: themeStandardDark,
};

const selector = createSelector(
  (store: ReduxStore) => store.ui.theme,
  (store: ReduxStore) => store.ui.locale,
  (store: ReduxStore) => store.ui.fontSize,
  (store: ReduxStore) => store.ui.device,
  (themeName, locale, fontSize, device) => ({ themeName, locale, fontSize, device }),
);

const Page: React.FC = () => {
  const { pathname } = useLocation();
  const locationRef = React.useRef(pathname);
  const { themeName, locale, fontSize, device } = useSelector(selector);
  const isDesktop = device === 'desktop';
  const isMobile = device === 'mobile';
  const isBlog = pathname.match(/^\/blog(\/.*|)$/) !== null;
  const { pages } = useLazyLoadQuery<PageQuery>(query, {
    path: pathname,
    isDesktop,
    isBlog,
    // firstPost: 10,
    // afterPost: null,
  });
  const { template, ...fragmentRef } = pages.resolve;

  const messages = React.useMemo(() => localeMap[locale], [locale]);
  const theme = React.useMemo(() => createTheme(themesMap[themeName]), [themeName]);

  React.useEffect(() => {
    if (locationRef.current !== pathname) {
      locationRef.current = pathname;

      if (typeof window !== 'undefined') {
        window.scrollTo({
          left: 0,
          top: 0,
        });
      }
    }
  }, [pathname]);
  const renderTemplate = React.useCallback(() => {
    const t = template?.__typename;

    switch (true) {
      case t === 'TemplateHomePage' && isDesktop:
        return <TemplateHomeDesktop fragmentRef={fragmentRef} />;

      case t === 'TemplateHomePage' && isMobile:
        return <TemplateHomeMobile fragmentRef={fragmentRef} />;

      case t === 'TemplateSecondPage':
        return <TemplateSecondDesktop fragmentRef={fragmentRef} />;

      case t === 'TemplateBlogPostPage':
        return <TemplateBlogPostDesktop fragmentRef={fragmentRef} />;

      case t === 'TemplateFallbackPage':
        return <TemplateFallbackDesktop fragmentRef={fragmentRef} />;

      case t === 'TemplateBlogPage':
        return <TemplateBlogDesktop fragmentRef={fragmentRef} />;

      default:
        return <>No template</>;
    }
  }, [template, isDesktop, fragmentRef, isMobile]);

  return (
    <>
      {/* <Helmet htmlAttributes={{ lang: locale }}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href={faviconPng} />
        <link rel="icon" type="image/x-icon" href={faviconIco} />
      </Helmet> */}
      <IntlProvider locale={locale} messages={messages}>
        <ThemeProvider theme={theme}>
          <GlobalStyles fontSize={fontSize} />
          {renderTemplate()}
        </ThemeProvider>
      </IntlProvider>
    </>
  );
};

export default Page;

graphql`
  query PageQuery($path: String!, $isDesktop: Boolean!, $isBlog: Boolean!) {
    pages {
      resolve(path: $path) {
        id
        statusCode
        template {
          __typename
        }
        ...TemplateHomeDesktopFragment @include(if: $isDesktop)
        ...TemplateHomeMobileFragment @skip(if: $isDesktop)
        ...TemplateFallbackDesktopFragment
        ...TemplateSecondDesktopFragment
        ...TemplateBlogPostDesktopFragment @include(if: $isBlog)
        ...TemplateBlogDesktopFragment @include(if: $isBlog)
      }
    }
  }
`;
