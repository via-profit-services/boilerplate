import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import ReactSyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-async-light';
import tsxLng from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
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

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = props => {
  const { code, language } = props;
  const { isDark } = useTheme();
  const styles = React.useMemo(() => {
    if (isDark) {
      return syntaxThemes.dark;
    }

    return syntaxThemes.light;
  }, [isDark]);

  const codeStr = String(code)
    .replace(/^\n/, '') // remove first empty line
    .replace(/\n$/g, ''); // remove last empty line

  return React.useMemo(
    () => (
      <>
        {typeof window === 'undefined' && (
          <>
            <PreSSR $styles={styles['pre[class*="language-"]']}>
              <CodeSSR $styles={styles['code[class*="language-"]']}>{codeStr}</CodeSSR>
            </PreSSR>
          </>
        )}

        {typeof window !== 'undefined' && (
          <ReactSyntaxHighlighter language={language} style={styles}>
            {codeStr}
          </ReactSyntaxHighlighter>
        )}
      </>
    ),
    [codeStr, language, styles],
  );
};

export default SyntaxHighlighter;
