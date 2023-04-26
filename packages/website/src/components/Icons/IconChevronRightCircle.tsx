import React from 'react';

const IconChevronRightCircle: React.ForwardRefRenderFunction<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
> = (props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 22"
    {...props}
    ref={ref}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M0 11C0 4.927 4.927 0 11 0s11 4.927 11 11-4.927 11-11 11S0 17.073 0 11zm11-9.308c-5.138 0-9.308 4.17-9.308 9.308 0 5.139 4.17 9.308 9.308 9.308 5.139 0 9.308-4.17 9.308-9.308S16.138 1.692 11 1.692zM8.286 5.325a.846.846 0 0 1 1.197 0l5.077 5.077c.33.33.33.866 0 1.196l-5.077 5.077a.846.846 0 1 1-1.197-1.196L12.765 11 8.286 6.521a.846.846 0 0 1 0-1.196z"
      clipRule="evenodd"
    />
  </svg>
);

export default React.forwardRef(IconChevronRightCircle);
