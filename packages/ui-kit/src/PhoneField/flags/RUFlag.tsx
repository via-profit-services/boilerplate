import * as React from 'react';

const RUFlag: React.ForwardRefRenderFunction<SVGSVGElement, React.SVGProps<SVGSVGElement>> = (
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
      <path fill="#fff" d="M0 0h512v512H0z" />
      <path fill="#0039a6" d="M0 170.7h512V512H0z" />
      <path fill="#d52b1e" d="M0 341.3h512V512H0z" />
    </g>
  </svg>
);

export default React.forwardRef(RUFlag);
