import React from 'react';

const IconChevronRight: React.ForwardRefRenderFunction<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
> = (props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="1em"
    height="1em"
    ref={ref}
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={48}
      d="m184 112 144 144-144 144"
    />
  </svg>
);

export default React.forwardRef(IconChevronRight);
