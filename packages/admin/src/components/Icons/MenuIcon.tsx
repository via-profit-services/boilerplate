import React from 'react';

const IconMenu: React.ForwardRefRenderFunction<SVGSVGElement, React.SVGProps<SVGSVGElement>> = (
  props,
  ref,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 512 512"
    {...props}
    ref={ref}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M464 95.917c0 17.627-14.361 31.916-32.077 31.916H143.231c-17.716 0-32.077-14.289-32.077-31.916C111.154 78.29 125.515 64 143.231 64h288.692C449.639 64 464 78.29 464 95.917ZM464 255.5c0 17.627-14.361 31.917-32.077 31.917H79.077C61.36 287.417 47 273.127 47 255.5c0-17.627 14.361-31.917 32.077-31.917h352.846c17.716 0 32.077 14.29 32.077 31.917ZM367.769 415.083c0 17.627-14.361 31.917-32.077 31.917H143.231c-17.716 0-32.077-14.29-32.077-31.917 0-17.627 14.361-31.916 32.077-31.916h192.461c17.716 0 32.077 14.289 32.077 31.916Z"
      clipRule="evenodd"
    />
  </svg>
);

export default React.forwardRef(IconMenu);
