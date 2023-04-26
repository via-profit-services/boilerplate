import * as React from 'react';
import { Global, css, useTheme } from '@emotion/react';

interface Props {
  readonly fontSize: FontSize;
}

const WebPageGlobalStyles: React.FC<Props> = props => {
  const { fontSize } = props;
  const theme = useTheme();

  return (
    <Global
      styles={css`
        :root {
          --font-size-small: ${theme.fontSize.small}px;
          --font-size-normal: ${theme.fontSize.normal}px;
          --font-size-medium: ${theme.fontSize.medium}px;
          --font-size-large: ${theme.fontSize.large}px;
        }

        html {
          height: 100%;
          font-weight: 400;
          font-family: system-ui;
          font-size: var(--font-size-${fontSize});
        }
        body {
          margin: 0;
          overflow-wrap: break-word;
          height: 100%;
          background-color: ${theme.colors.background.default};
          color: ${theme.colors.text.default};
        }
        #app {
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }

        * {
          box-sizing: border-box;
        }
      `}
    />
  );
};

export default WebPageGlobalStyles;
