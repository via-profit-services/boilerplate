import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Color from 'color';

export interface CalendarDayProps extends React.HTMLAttributes<HTMLButtonElement> {
  readonly isNotCurrentMonth?: boolean;
  readonly isToday?: boolean;
}

const Btn = styled.button<{ $isNotCurrentMonth?: boolean; $isToday?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
  flex: 1;
  ${({ $isNotCurrentMonth, $isToday, theme }) => {
    switch (true) {
      case $isNotCurrentMonth:
        return css`
          opacity: 0.2;
        `;
      case $isToday:
        return css`
          color: ${theme.colors.accentPrimary};
        `;

      default:
        return css``;
    }
  }}

  outline: 1px solid ${({ theme }) => theme.colors.textSecondary};
  &:hover {
    background-color: ${({ theme }) =>
      Color(theme.colors.accentPrimary).darken(0.1).rgb().string()};
  }
  &:active {
    background-color: ${({ theme }) =>
      Color(theme.colors.accentPrimary).darken(0.2).rgb().string()};
  }
  &:focus-visible {
    outline: 2px solid
      ${({ theme }) => Color(theme.colors.accentPrimary).darken(0.3).rgb().string()};
  }
`;

const CalendarDay: React.ForwardRefRenderFunction<HTMLButtonElement, CalendarDayProps> = (
  props,
  ref,
) => {
  const { isToday, isNotCurrentMonth, children, ...restProps } = props;

  return (
    <Btn {...restProps} ref={ref} $isToday={isToday} $isNotCurrentMonth={isNotCurrentMonth}>
      {children}
    </Btn>
  );
};

export default React.forwardRef(CalendarDay);
