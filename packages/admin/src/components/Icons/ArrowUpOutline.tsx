import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';

const ArrowUpOutline = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 512 512"
    ref={ref}
    {...props}
  >
    <path
      d="M258.09 76.092a24.002 24.002 0 0 0-8.303.727 24.002 24.002 0 0 0-10.76 6.21l-144 144a24 24 0 0 0 0 33.941 24 24 0 0 0 33.941 0l103.03-103.03V412a24 24 0 0 0 24 24 24 24 0 0 0 24-24V157.94l103.03 103.03a24 24 0 0 0 33.941 0 24 24 0 0 0 0-33.94l-144-144a24.002 24.002 0 0 0-14.879-6.938z"
      fill="currentColor"
    />
  </svg>
);

const ForwardRef = forwardRef(ArrowUpOutline);
export default ForwardRef;
