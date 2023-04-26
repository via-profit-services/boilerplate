import React from 'react';

const IconEnter: React.ForwardRefRenderFunction<SVGSVGElement, React.SVGProps<SVGSVGElement>> = (
  props,
  ref,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="0.9em"
    fill="none"
    viewBox="0 0 22 19"
    {...props}
    ref={ref}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10.999 0c-.306 0-.607.07-.881.206L1.54 4.439h-.001A2.75 2.75 0 0 0 0 6.9v9.067c0 1.529 1.252 2.75 2.775 2.75h16.45c1.523 0 2.775-1.221 2.775-2.75V6.9a2.75 2.75 0 0 0-1.541-2.46h-.002L11.88.206A1.992 1.992 0 0 0 11 0zm8.536 5.736-8.35-4.121a.42.42 0 0 0-.372 0l-8.509 4.2 5.962 4.502 1.396-1.086a1.964 1.964 0 0 1 2.412 0l1.404 1.092 6.057-4.587zM1.572 7.23v8.736c0 .642.53 1.179 1.204 1.179h16.45c.674 0 1.204-.537 1.204-1.178V7.03l-5.667 4.291 3.66 2.846a.786.786 0 0 1-.483 1.406H3.797a.786.786 0 0 1-.482-1.406l3.666-2.852-5.41-4.086zm9.056 3.241a.393.393 0 0 1 .482 0l4.54 3.531H6.087l4.54-3.53z"
      clipRule="evenodd"
    />
  </svg>
);

export default React.forwardRef(IconEnter);
