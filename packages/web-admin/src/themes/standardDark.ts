import { Theme } from '@emotion/react';

import standardLight from './standardLight';

const standardDark: Theme = {
  ...standardLight,
  isDark: true,
  colors: {
    ...standardLight.colors,
    background: {
      ...standardLight.colors.background,
      default: 'rgb(19, 19, 19)',
      area: 'rgb(26, 28, 30)',
      panel: '#1a1c1e',
      drawer:
        'linear-gradient(45deg, rgb(26, 28, 30) 10%, rgb(29, 26, 30) 60%, rgb(59, 25, 100) 100%)',
    },
    text: {
      ...standardLight.colors.text,
      default: 'rgb(255, 255, 255)',
    },
  },
  borders: {
    ...standardLight.borders,
    standard1: '1px solid rgba(210, 171, 242, 0.16)',
  },
  shadows: {
    ...standardLight.shadows,
    elevation1:
      'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px',
  },
};

export default standardDark;
