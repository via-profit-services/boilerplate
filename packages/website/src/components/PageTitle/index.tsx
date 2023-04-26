import React from 'react';
import styled from '@emotion/styled';

const H1 = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
`;

export interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children?: React.ReactNode | React.ReactNode[];
}

const PageTitle: React.ForwardRefRenderFunction<HTMLDivElement, PageTitleProps> = (props, ref) => {
  const { children } = props;

  if (!children) {
    return null;
  }

  return <H1 ref={ref}>{children}</H1>;
};

export default React.forwardRef(PageTitle);
