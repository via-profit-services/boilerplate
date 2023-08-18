import * as React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
`;

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loader = styled.div`
  border-radius: 50%;
  width: 1em;
  height: 1em;
  color: #111111;
  font-size: 10px;
  margin: 0 auto;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  animation: ${pulse} 1.8s infinite ease-in-out;
  animation-fill-mode: both;
  animation-delay: -0.16s;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -200%;
    border-radius: 50%;
    width: inherit;
    height: inherit;
    animation: ${pulse} 1.8s infinite ease-in-out;
    animation-fill-mode: both;
    animation-delay: -0.32s;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 200%;
    border-radius: 50%;
    width: inherit;
    height: inherit;
    animation-fill-mode: both;
    animation: ${pulse} 1.8s infinite ease-in-out;
    animation-delay: 0;
  }
`;

type Props = React.HTMLAttributes<HTMLDivElement>;

export const LoadingIndicator: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  props,
  ref,
) => (
  <Container {...props} ref={ref}>
    <Loader />
  </Container>
);

export default React.forwardRef(LoadingIndicator);
