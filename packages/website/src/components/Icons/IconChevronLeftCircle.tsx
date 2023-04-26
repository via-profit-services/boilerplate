import React from 'react';

const IconChevronLeftCircle: React.ForwardRefRenderFunction<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
> = (props, ref) => (
  <svg
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 22"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 11c0-6.073-4.927-11-11-11S0 4.927 0 11s4.927 11 11 11 11-4.927 11-11ZM11 1.692c5.139 0 9.308 4.17 9.308 9.308 0 5.139-4.17 9.308-9.308 9.308S1.692 16.138 1.692 11 5.862 1.692 11 1.692Zm2.714 3.633a.846.846 0 0 0-1.197 0L7.44 10.402a.846.846 0 0 0 0 1.196l5.077 5.077a.846.846 0 1 0 1.197-1.196L9.235 11l4.479-4.479a.846.846 0 0 0 0-1.196Z"
      fill="currentColor"
    />
  </svg>
);

export default React.forwardRef(IconChevronLeftCircle);
