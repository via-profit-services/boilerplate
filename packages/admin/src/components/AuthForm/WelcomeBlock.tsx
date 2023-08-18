import React from 'react';
import styled from '@emotion/styled';

export type WelcomeBlockProps = React.HTMLAttributes<HTMLDivElement>;

const Container = styled.div`
  width: 40em;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  background-color: ${({ theme }) => theme.color.accentPrimary.toString()};
  color: ${({ theme }) => theme.color.accentPrimaryContrast.toString()};
`;

const WelcomeBlockWithRef: React.ForwardRefRenderFunction<HTMLDivElement, WelcomeBlockProps> = (
  props,
  ref,
) => {
  [];

  return (
    <Container {...props} ref={ref}>
      
    </Container>
  );
};

const WelcomeBlock = React.forwardRef(WelcomeBlockWithRef);

export default WelcomeBlock;
