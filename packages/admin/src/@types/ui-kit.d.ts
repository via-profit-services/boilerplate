import { UIThemeOverrideZIndex as ZIndexes } from '@via-profit/ui-kit';

declare module '@via-profit/ui-kit' {
  export interface UIThemeOverrideZIndex extends ZIndexes {
    readonly sidebar: number;
  }
}
