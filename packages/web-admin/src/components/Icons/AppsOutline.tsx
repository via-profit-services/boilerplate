import * as React from 'react';
import { SVGProps, Ref, forwardRef } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 512 512"
    ref={ref}
    {...props}
  >
    <rect
      x={64}
      y={64}
      width={80}
      height={80}
      rx={40}
      ry={40}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <rect
      x={216}
      y={64}
      width={80}
      height={80}
      rx={40}
      ry={40}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <rect
      x={368}
      y={64}
      width={80}
      height={80}
      rx={40}
      ry={40}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <rect
      x={64}
      y={216}
      width={80}
      height={80}
      rx={40}
      ry={40}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <rect
      x={216}
      y={216}
      width={80}
      height={80}
      rx={40}
      ry={40}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <rect
      x={368}
      y={216}
      width={80}
      height={80}
      rx={40}
      ry={40}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <rect
      x={64}
      y={368}
      width={80}
      height={80}
      rx={40}
      ry={40}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <rect
      x={216}
      y={368}
      width={80}
      height={80}
      rx={40}
      ry={40}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <rect
      x={368}
      y={368}
      width={80}
      height={80}
      rx={40}
      ry={40}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
  </svg>
);

const ForwardRef = forwardRef(SvgComponent);
export default ForwardRef;
