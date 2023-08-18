import React from 'react';
import styled from '@emotion/styled';
import ReactSyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-async-light';
import tsxLng from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import lightSyntaxTheme from './lightSyntaxTheme';
import darkSyntaxTheme from './darkSyntaxTheme';

ReactSyntaxHighlighter.registerLanguage('tsx', tsxLng);

interface SyntaxHighlighterProps {
  readonly language: 'tsx';
  readonly code: string;
}

export const syntaxThemes: Record<'light' | 'dark', typeof lightSyntaxTheme> = {
  light: lightSyntaxTheme,
  dark: darkSyntaxTheme,
};

const CodeSSR = styled.code<{ $styles: Record<string, any> }>`
  ${props => props.$styles};
`;

const PreSSR = styled.pre<{ $styles: Record<string, any> }>`
  ${props => props.$styles};
`;

const selector = createSelector(
  (store: ReduxStore) => store.ui.theme,
  theme => ({ theme }),
);

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = props => {
  const { code, language } = props;
  const { theme } = useSelector(selector);
  const styles = React.useMemo(() => {
    if (theme === 'standardDark') {
      return syntaxThemes.dark;
    }

    return syntaxThemes.light;
  }, [theme]);

  const codeStr = String(code)
    .replace(/^\n/, '') // remove first empty line
    .replace(/\n$/g, ''); // remove last empty line

  if (typeof window === 'undefined') {
    return (
      <PreSSR $styles={styles['pre[class*="language-"]']}>
        <CodeSSR $styles={styles['code[class*="language-"]']}>{codeStr}</CodeSSR>
      </PreSSR>
    );
  }

  return (
    <ReactSyntaxHighlighter language={language} style={styles}>
      {codeStr}
    </ReactSyntaxHighlighter>
  );
};

export default SyntaxHighlighter;
