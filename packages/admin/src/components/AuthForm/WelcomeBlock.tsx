import React from 'react';
import styled from '@emotion/styled';

import background from '~/assets/auth-screen-banner.png';

export type WelcomeBlockProps = React.HTMLAttributes<HTMLDivElement>;

const Container = styled.div`
  width: 40em;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  background-image: url(${background});
  background-size: cover;
  background-color: ${({ theme }) => theme.color.accentPrimary.toString()};
  color: ${({ theme }) => theme.color.accentPrimaryContrast.toString()};
`;

const WelcomeBlockWithRef: React.ForwardRefRenderFunction<HTMLDivElement, WelcomeBlockProps> = (
  props,
  ref,
) => <Container {...props} ref={ref} />;

const WelcomeBlock = React.forwardRef(WelcomeBlockWithRef);

export default WelcomeBlock;
