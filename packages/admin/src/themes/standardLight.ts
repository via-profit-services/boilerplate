import { UIThemeOverrides } from '@via-profit/ui-kit/ThemeProvider';

const standardLight: UIThemeOverrides = {
  isDark: false,
  fontSize: {
    small: 14,
    normal: 16,
    medium: 18,
    large: 21,
  },
  zIndex: {
    sidebar: 10,
    header: 20,
    modal: 30,
  },
  color: {
    backgroundPrimary: '#f6f7f9',
    backgroundSecondary: '#ebebeb',
    textPrimary: '#212121',
    textSecondary: '#6d6d6d',
    accentPrimary: '#5c38ff',
    accentPrimaryContrast: '#FFFFFF',
    accentSecondary: '#eeeaff',
    accentSecondaryContrast: '#5732ff',
    error: '#e2574c',
    surface: '#fff',
  },
  shape: {
    radiusFactor: 0.4,
  },
};

export default standardLight;
