import React from 'react';
import styled from '@emotion/styled';

export type ButtonBaseProps = React.HTMLAttributes<HTMLButtonElement>;

const Button = styled.button`
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
  padding: 0.8em 1em;
  cursor: pointer;
  font-size: 1em;
  border: 0;
  outline: transparent;
  transition: all 180ms ease-out 0s;
  background: none;
  color: currentColor;
`;

const ButtonText = styled.span`
  font-size: 0.86em;
`;

const ButtonBase: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonBaseProps> = (
  props,
  ref,
) => {
  const { children, ...otherProps } = props;

  return (
    <Button {...otherProps} ref={ref}>
      <ButtonText>{children}</ButtonText>
    </Button>
  );
};

export default React.forwardRef(ButtonBase);
