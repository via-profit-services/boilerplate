import '@emotion/react';
import { UITheme } from '@via-profit/ui-kit/ThemeProvider';

declare module '@emotion/react' {
  export interface Theme extends UITheme {}
}
