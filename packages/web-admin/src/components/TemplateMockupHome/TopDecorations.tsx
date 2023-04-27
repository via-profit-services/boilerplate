import React from 'react';
import styled from '@emotion/styled';

const FigureOne = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  height: 33em;
  width: calc(100% - 22em);
  pointer-events: none;
  z-index: -1;
  & > path {
    fill: ${({ theme }) => (theme.isDark ? '#2b2a2a' : '#f3f3f3')};
  }
`;

const FigureTwo = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  width: 20em;
  pointer-events: none;
  z-index: -1;
  & > path {
    fill: ${({ theme }) => (theme.isDark ? '#2b2a2a' : '#f3f3f3')};
  }
`;

const TopDecorations: React.FC = () => (
  <>
    <FigureOne
      xmlns="http://www.w3.org/2000/svg"
      width="897"
      height="743"
      fill="none"
      viewBox="0 0 897 743"
      preserveAspectRatio="none"
    >
      <path d="M861 457.5C949.4 293.1 853.17 84 794 0H0v649c122.5 26.17 400.8 81.3 534 92.5 166.5 14 216.5-78.5 327-284Z" />
    </FigureOne>
    <FigureTwo
      xmlns="http://www.w3.org/2000/svg"
      width="529"
      height="224"
      fill="none"
      viewBox="0 0 529 224"
      preserveAspectRatio="none"
    >
      <path d="M144.5 159c62.25 29.46 377.5 64.5 384.5 64.5V0H0c22.5 53.5 42 110.5 144.5 159Z" />
    </FigureTwo>
  </>
);

export default TopDecorations;
