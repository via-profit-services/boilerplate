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
  },
  shadows: {
    standard1: 'rgb(45 35 66 / 40%) 0px 2px 4px, rgb(45 35 66 / 30%) 0px 1px 2px -2px',
    standard2: 'rgb(45 35 66 / 56%) 0px 2px 4px, rgb(45 35 66 / 81%) 0px 2px 2px -2px',
    standardInner: 'rgb(214 214 231) 0px 3px 7px inset',
    elevation0: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
    elevation1: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
    elevation2: 'rgba(0, 0, 0, 0.04) 0px 0px 6px',
  },
  borders: {
    standard1: '1px solid rgba(0, 0, 0, 0.1)',
  },
  colors: {
    background: {
      default: '#f7f7f7',
      area: '#fff',
      drawer: '#fff',
      panel: '#fff',
    },
    text: {
      secondary: '#686666',
      default: '#212121',
    },
  },
};

export default standardLight;
