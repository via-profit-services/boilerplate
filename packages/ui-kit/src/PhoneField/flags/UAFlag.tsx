import * as React from 'react';

const UAFlag: React.ForwardRefRenderFunction<SVGSVGElement, React.SVGProps<SVGSVGElement>> = (
  props,
  ref,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 512 512"
    ref={ref}
    {...props}
  >
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="gold" d="M0 0h512v512H0z" />
      <path fill="#0057b8" d="M0 0h512v256H0z" />
    </g>
  </svg>
);

export default React.forwardRef(UAFlag);
