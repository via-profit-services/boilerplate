import { Theme } from '@emotion/react';

const standardLight: Theme = {
  isDark: false,
  fontSize: {
    small: 14,
    normal: 16,
    medium: 18,
    large: 20,
  },
  zIndex: {
    header: 8,
    mainDrawer: 9,
    modal: 10,
  },
  grid: {
    frameGutter: 30,
    safeFrame: '80rem',
  },
  colors: {
    backgroundPrimary: '#fff',
    backgroundSecondary: '#F9F9F9',
    backgroundGrey: '#F4F6FA',
    textPrimary: '#212121',
    textSecondary: '#343434',
    accentPrimary: '#FFA800',
    accentPrimaryContrast: '#FFFFFF',
    accentSecondary: '#bd00ff',
    accentSecondaryContrast: '#FFFFFF',
    error: '#ff2b2b',
  },
  shape: {
    radiusFactor: 0.5,
  },
};

export default standardLight;
