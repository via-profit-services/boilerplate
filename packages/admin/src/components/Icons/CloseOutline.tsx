import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';

const CloseOutline = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 512 512"
    ref={ref}
    {...props}
  >
    <path
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 32,
      }}
      d="M368 368 144 144M368 144 144 368"
    />
  </svg>
);

const ForwardRef = forwardRef(CloseOutline);
export default ForwardRef;
