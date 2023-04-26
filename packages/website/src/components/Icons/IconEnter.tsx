import React from 'react';

const IconEnter: React.ForwardRefRenderFunction<SVGSVGElement, React.SVGProps<SVGSVGElement>> = (
  props,
  ref,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="0.8em"
    fill="none"
    viewBox="0 0 22 18"
    {...props}
    ref={ref}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M9.036 1.571A1.179 1.179 0 0 0 7.857 2.75v1.964a.786.786 0 0 1-1.571 0V2.75A2.75 2.75 0 0 1 9.036 0H19.25A2.75 2.75 0 0 1 22 2.75v11.786a2.75 2.75 0 0 1-2.75 2.75H9.036a2.75 2.75 0 0 1-2.75-2.75V12.57a.786.786 0 0 1 1.571 0v1.965a1.179 1.179 0 0 0 1.179 1.178H19.25a1.179 1.179 0 0 0 1.179-1.178V2.75a1.179 1.179 0 0 0-1.179-1.179H9.036zm2.449 2.417a.786.786 0 0 1 .856.17l3.929 3.93a.786.786 0 0 1 0 1.11l-3.929 3.929A.786.786 0 0 1 11 12.571V9.43H.786a.786.786 0 1 1 0-1.572H11V4.714c0-.318.191-.604.485-.726zm1.086 5.44v1.246l1.246-1.245h-1.246zm1.246-1.57h-1.246V6.61l1.246 1.246z"
      clipRule="evenodd"
    />
  </svg>
);

export default React.forwardRef(IconEnter);
