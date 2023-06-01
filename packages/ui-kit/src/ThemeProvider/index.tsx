import React from "react";
import { ThemeProvider as EmotionProvider } from "@emotion/react";
import type { Theme } from "@boilerplate/ui-kit";

import defaultTheme from "./defaultTheme";

export { Theme };

export interface ThemeProviderProps {
  readonly children: React.ReactNode | readonly React.ReactNode[];
  readonly theme?: Theme;
}

const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const { children, theme } = props;
  const currentTheme = React.useMemo(
    () => ({
      ...defaultTheme,
      ...theme,
    }),
    [theme]
  );

  return <EmotionProvider theme={currentTheme}>{children}</EmotionProvider>;
};

export default ThemeProvider;
