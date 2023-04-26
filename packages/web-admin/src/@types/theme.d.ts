import '@emotion/react';

declare module '@emotion/react' {
  type ColorRange = Record<'lightest' | 'light' | 'normal' | 'dark' | 'darkest', string>;
  export interface Theme {
    isDark: boolean;
    fontSize: Record<'small' | 'normal' | 'medium' | 'large', number>;
    zIndex: {
      header: number;
      mainDrawer: number;
      modal: number;
    };
    grid: {
      frameGutter: number;
    };
    shadows: {
      standard1: string;
      standard2: string;
      standardInner: string;
      elevation0: string;
      elevation1: string;
      elevation2: string;
    };
    borders: {
      standard1: string;
    };
    colors: {
      background: {
        default: string;
        area: string;
        drawer: string;
        panel: string;
      };
      text: {
        secondary: string;
        default: string;
      };
    };
  }
}
