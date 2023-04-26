import React from 'react';
import styled from '@emotion/styled';

export interface BulletProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

const StyledBullet = styled.button<{ $isActive?: boolean }>`
  background-color: transparent;
  outline: none;
  border: 0;
  border-radius: 0;
  position: relative;
  width: 1.8em;
  height: 1.8em;
  margin: 0;
  opacity: ${props => (props.$isActive ? 1 : 0.4)};
  cursor: pointer;
  &:before {
    content: '';
    transition: inset 80ms ease-out;
    position: absolute;
    border-radius: 100%;
    inset: ${props => (props.$isActive ? 0.5 : 0.65)}em;
    background-color: currentColor;
  }
`;

const SliderBulletRef: React.ForwardRefRenderFunction<HTMLButtonElement, BulletProps> = (
  props,
  ref,
) => {
  const { isActive, ...otherProps } = props;

  return <StyledBullet $isActive={isActive} {...otherProps} ref={ref} />;
};

export const SliderBullet = React.forwardRef(SliderBulletRef);
export default SliderBullet;
