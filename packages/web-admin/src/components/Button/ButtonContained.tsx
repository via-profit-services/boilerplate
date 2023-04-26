import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import ButtonBase from './ButtonBase';

export type ButtonContainedColorVariant = 'default' | 'accent';

export interface ButtonContainedProps extends React.ComponentPropsWithoutRef<'button'> {
  readonly color?: ButtonContainedColorVariant;
  readonly children: React.ReactNode;
}

const Button = styled(ButtonBase)<{ $color: ButtonContainedColorVariant }>`
  ${props =>
    props.$color === 'default' &&
    css`
      color: #1f1f36;
      border-radius: 1em;
      background: linear-gradient(rgb(255, 255, 255), rgb(245, 245, 250));
      box-shadow: ${props.theme.shadows.standard1};
      &:hover {
        background: linear-gradient(rgb(255, 255, 255) 60%, rgb(244, 239, 231) 80%);
        box-shadow: ${props.theme.shadows.standard2};
      }
      &:active {
        box-shadow: ${props.theme.shadows.standardInner};
        /* background: #fcfcfd; */
      }
      &:focus {
        outline-color: rgb(255 200 131);
      }
    `}
  ${props =>
    props.$color === 'accent' &&
    css`
      border-radius: 1em;
      background: rgb(247, 184, 0) linear-gradient(rgb(247, 184, 0), rgb(242, 181, 2));
      box-shadow: ${props.theme.shadows.standard1};
      &:hover {
        background: rgb(251, 188, 0) linear-gradient(rgb(251, 188, 0) 60%, rgb(244, 173, 2) 80%);
        box-shadow: ${props.theme.shadows.standard2};
      }
      &:active {
        background: rgb(255, 179, 0);
        box-shadow: ${props.theme.shadows.standardInner};
      }
      &:focus {
        outline-color: rgb(249, 145, 53);
      }
    `}
`;

const ButtonContained: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonContainedProps> = (
  props,
  ref,
) => {
  const { children, color, ...otherProps } = props;
  const $color = color || 'default';

  return (
    <Button $color={$color} {...otherProps} ref={ref}>
      {children}
    </Button>
  );
};

export default React.forwardRef(ButtonContained);
