import React from 'react';

const IconAir: React.ForwardRefRenderFunction<SVGSVGElement, React.SVGProps<SVGSVGElement>> = (
  props,
  ref,
) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 13.421 14.022"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      style={{
        strokeWidth: 0.184,
        strokeMiterlimit: 4,
        strokeDasharray: 'none',
        stroke: 'none',
        fill: 'currentColor',
        fillOpacity: 1,
      }}
      d="M38.031 65.17a6.71 7.01 0 0 1-6.71 7.012 6.71 7.01 0 0 1-6.71-7.011 6.71 7.01 0 0 1 6.71-7.011 6.71 7.01 0 0 1 6.71 7.01z"
      transform="translate(-24.61 -58.16)"
    />
  </svg>
);

export default React.forwardRef(IconAir);
