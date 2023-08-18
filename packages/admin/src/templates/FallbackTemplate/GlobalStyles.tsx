import React from 'react';
import { Global, css, useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

const selector = createStructuredSelector({
  currentFontSize: (store: ReduxStore) => store.ui.fontSize,
});

const GlobalStyles: React.FC = () => {
  const theme = useTheme();
  const { currentFontSize } = useSelector(selector);

  return (
    <Global
      styles={css`
        :root {
          --font-size-small: ${theme.fontSize.small}px;
          --font-size-normal: ${theme.fontSize.normal}px;
          --font-size-medium: ${theme.fontSize.medium}px;
          --font-size-large: ${theme.fontSize.large}px;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background-color: ${theme.color.backgroundPrimary.toString()};
          color: ${theme.color.textPrimary.toString()};
          font-family: 'Open Sans', system-ui;
          font-size: var(--font-size-${currentFontSize});
        }

        ::selection {
          background-color: ${theme.isDark
            ? theme.color.accentPrimary.darken(60).toString()
            : theme.color.accentPrimary.toString()};
          color: ${theme.color.accentPrimaryContrast.toString()};
        }
        &::-webkit-scrollbar {
          width: 0.6rem;
          height: 0.6rem;
        }
        &::-webkit-scrollbar-corner {
          background: none;
        }
        &::-webkit-scrollbar-track {
          background: none;
        }
        &::-webkit-scrollbar-thumb {
          background: ${theme.color.accentPrimary.darken(20).toString()};
          border-radius: 4px;
        }

        &::-webkit-scrollbar-thumb:horizontal:hover,
        &::-webkit-scrollbar-thumb:vertical:hover {
          background: ${theme.color.accentPrimary.lighten(20).toString()};
        }
      `}
    />
  );
};

export default GlobalStyles;
