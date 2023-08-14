import type { UIThemeOverrides } from '@via-profit/ui-kit/ThemeProvider';

import standardLight from './standardLight';

const standardDark: UIThemeOverrides = {
  ...standardLight,
  isDark: true,
  color: {
    ...standardLight.color,
    backgroundPrimary: '#1a1825',
    textPrimary: '#c7c2e7',
    surface: '#1a1825',
  },
};

export default standardDark;
