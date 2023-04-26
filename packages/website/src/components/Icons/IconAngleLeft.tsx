import React from 'react';

const IconAngleRight: React.ForwardRefRenderFunction<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
> = (props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="0.7em"
    height="1em"
    fill="none"
    viewBox="0 0 9 16"
    {...props}
    ref={ref}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8.67.335c.44.446.44 1.17 0 1.616L2.717 8l5.955 6.049c.439.446.439 1.17 0 1.616a1.113 1.113 0 0 1-1.591 0L.33 8.808a1.156 1.156 0 0 1 0-1.616L7.08.335a1.113 1.113 0 0 1 1.59 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default React.forwardRef(IconAngleRight);
