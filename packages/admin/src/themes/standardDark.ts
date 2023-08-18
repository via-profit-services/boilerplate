import light from './standardLight';

const dark: typeof light = {
  ...light,
  isDark: true,
  color: {
    ...light.color,
    backgroundPrimary: '#262629',
    backgroundSecondary: '#262739',
    accentPrimary: '#66b13d',
    accentPrimaryContrast: '#f1f1f1',
    accentSecondary: '#fce240',
    accentSecondaryContrast: '#f1f1f1',
    textPrimary: '#c4c4d8',
    textSecondary: '#717275',
    surface: '#1b1b1b',
  },
};

export default dark;
