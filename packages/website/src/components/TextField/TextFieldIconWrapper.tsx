import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export type TextFieldIconWrapperProps = React.InputHTMLAttributes<HTMLDivElement> & {
  readonly position: 'start' | 'end';
};

const IconWrapper = styled.div<{ $position: TextFieldIconWrapperProps['position'] }>`
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ $position }) =>
    $position === 'start' &&
    css`
      border-top-left-radius: inherit;
      border-bottom-left-radius: inherit;
    `};
  ${({ $position }) =>
    $position === 'end' &&
    css`
      border-top-right-radius: inherit;
      border-bottom-right-radius: inherit;
    `};
  & > svg {
    margin: 0 1em;
    border-radius: inherit;
  }
  & > button {
    height: 100%;
    padding: 0 1em;
    border-radius: inherit;
    box-shadow: none;
  }
`;

const TextFieldIconWrapper: React.ForwardRefRenderFunction<
  HTMLDivElement,
  TextFieldIconWrapperProps
> = (props, ref) => {
  const { children, position, ...otherProps } = props;

  return (
    <IconWrapper $position={position} {...otherProps} ref={ref}>
      {children}
    </IconWrapper>
  );
};

export default React.forwardRef(TextFieldIconWrapper);
