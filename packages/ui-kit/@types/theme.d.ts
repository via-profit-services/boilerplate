declare module '@boilerplate/ui-kit' {
  export interface Theme {
    isDark: boolean;
    fontSize: Record<"small" | "normal" | "medium" | "large", number>;
    zIndex: {
      header: number;
      mainDrawer: number;
      modal: number;
    };
    grid: {
      frameGutter: number;
      safeFrame: string;
    };
    colors: {
      backgroundPrimary: string;
      backgroundSecondary: string;
      backgroundGrey: string;
      textPrimary: string;
      textSecondary: string;
      accentPrimary: string;
      accentPrimaryContrast: string;
      accentSecondary: string;
      accentSecondaryContrast: string;
      error: string;
    };
    shape: {
      radiusFactor: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
    };
  }
}