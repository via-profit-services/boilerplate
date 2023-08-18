import React from 'react';
import styled from '@emotion/styled';

const Figure = styled.svg`
  position: absolute;
  top: -1em;
  right: 0;
  height: 26em;
  width: 26em;
  pointer-events: none;
  z-index: -1;
  & > path {
    fill: ${({ theme }) => (theme.isDark ? '#2b2a2a' : '#f3f3f3')};
  }
`;

const MiddleDecorations: React.FC = () => (
  <>
    <Figure
      xmlns="http://www.w3.org/2000/svg"
      width="471"
      height="498"
      fill="none"
      viewBox="0 0 471 498"
      preserveAspectRatio="none"
    >
      <path d="M471 45.08 123.92.48c-9.75-2-49.05 1.5-53.73 24.45-17.81 87.28-30.31 158.52-42.52 228.08-8.66 49.36-17.18 97.89-27.34 150.7-1.59 6 2.4 23.56 14.33 29.95 13.87 7.42 23.44 8.23 33.17 9.05 4.67.4 9.37.8 14.6 1.93l395.22 49.9c3.46.75 8.22 1.67 13.35 2.48V45.08Z" />
    </Figure>
  </>
);

export default MiddleDecorations;
