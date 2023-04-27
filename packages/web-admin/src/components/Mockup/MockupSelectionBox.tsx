import React from 'react';
import styled from '@emotion/styled';

import MockupBaseElement, { MockupBaseElementProps } from './MockupBaseElement';

export type MockupSelectionBoxProps = MockupBaseElementProps & {
  readonly tooptip: React.ReactNode;
  readonly disabled?: boolean;
  readonly onEdit?: () => void;
};

interface StyleProps {
  readonly $disabled: boolean;
}

const Container = styled(MockupBaseElement)<StyleProps>`
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  border-radius: 1em;
  outline-width: 2px;
  outline-style: dotted;
  outline-color: transparent;
  transition: outline-color 200ms ease-out;
  color: ${({ theme, $disabled }) => {
    if ($disabled) {
      return theme.isDark ? '#751818' : '#c00000';
    }

    return theme.isDark ? '#52ad61' : '#06c000';
  }};
  &:hover {
    outline-color: currentColor;
  }
  &:before {
    content: '';
    z-index: 1;
    position: absolute;
    transition: opacity 200ms ease-out;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
    background-color: currentColor;
  }
  &:hover:before {
    opacity: 0.1;
    visibility: visible;
  }
  &:focus-visible {
    opacity: 1;
    outline-style: solid;
    outline-width: 4px;
    outline-color: currentColor;
  }
`;

const MockupSelectionBox: React.ForwardRefRenderFunction<
  HTMLDivElement,
  MockupSelectionBoxProps
> = (props, ref) => {
  const { children, tabIndex, tooptip, disabled, onClick, onEdit, onKeyDown, ...otherProps } =
    props;

  return (
    <Container
      $disabled={Boolean(disabled)}
      onClick={event => {
        if (typeof onClick === 'function') {
          onClick(event);
        }
        if (typeof onEdit === 'function' && !disabled) {
          onEdit();
        }
      }}
      onKeyDown={event => {
        if (typeof onKeyDown === 'function') {
          onKeyDown(event);
        }
        if (
          typeof onEdit === 'function' &&
          !disabled &&
          ['Enter', 'NumpadEnter', 'Space'].includes(event.code)
        ) {
          onEdit();
        }
      }}
      tabIndex={typeof tabIndex === 'number' ? tabIndex : 1}
      {...otherProps}
      ref={ref}
      title={String(tooptip)}
    >
      {children}
    </Container>
  );
};

export default React.forwardRef(MockupSelectionBox);
