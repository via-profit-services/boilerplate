import type { usePopper } from 'react-popper';

export type PopperOptions = Parameters<typeof usePopper>[2];

export const popperOptions: PopperOptions = {
  placement: 'bottom',
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    },
    {
      name: 'flip',
      enabled: true,
      options: {
        altBoundary: true,
        padding: 8,
      },
    },
    {
      name: 'preventOverflow',
      enabled: true,
      options: {
        altAxis: true,
        altBoundary: true,
        tether: true,
        padding: 8,
      },
    },
  ],
};

export default popperOptions;
