import React from 'react';
import styled from '@emotion/styled';
import Color from 'color';

export interface CalendarCellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly isToday?: boolean;
  readonly isSelected?: boolean;
}

const Btn = styled.button<{
  $isNotCurrentMonth?: boolean;
  $isToday?: boolean;
  $isSelected?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  width: 3em;
  height: 3em;
  margin: 0;
  min-width: 0;
  outline: none;
  cursor: pointer;
  border: 1px solid transparent;
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.accentPrimary : theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 3}em;
  color: ${({ $isToday, theme, $isSelected }) => {
    if ($isSelected) {
      return theme.colors.accentPrimaryContrast;
    }
    if ($isToday) {
      return theme.colors.accentPrimary;
    }

    return theme.colors.textPrimary;
  }};
  &:hover {
    background-color: ${({ theme, $isSelected }) =>
      Color($isSelected ? theme.colors.accentPrimary : theme.colors.backgroundPrimary)
        .darken(0.1)
        .rgb()
        .string()};
  }
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.accentPrimary};
  }
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

const CalendarCell: React.ForwardRefRenderFunction<HTMLButtonElement, CalendarCellProps> = (
  props,
  ref,
) => {
  const { isToday, children, isSelected, ...restProps } = props;

  return (
    <Btn type="button" {...restProps} ref={ref} $isToday={isToday} $isSelected={isSelected}>
      {children}
    </Btn>
  );
};

export default React.forwardRef(CalendarCell);
