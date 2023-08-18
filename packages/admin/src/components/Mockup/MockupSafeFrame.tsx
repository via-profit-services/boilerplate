import React from 'react';
import styled from '@emotion/styled';

export type MockupSafeFrameProps = React.HTMLAttributes<HTMLDivElement>;

const Container = styled.div`
  margin: 0 auto;
  width: calc(100% - 8em);
  max-width: 75em;
`;

const MockupSafeFrame: React.ForwardRefRenderFunction<HTMLDivElement, MockupSafeFrameProps> = (
  props,
  ref,
) => {
  const { children, ...otherProps } = props;

  return (
    <Container {...otherProps} ref={ref}>
      {children}
    </Container>
  );
};

export default React.forwardRef(MockupSafeFrame);
