import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';

const ArrowRightOutline = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 512 512"
    ref={ref}
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="48"
      d="m268 112 144 144-144 144m124-144H100"
    />
  </svg>
);

const ForwardRef = forwardRef(ArrowRightOutline);
export default ForwardRef;
