import React from 'react';
import styled from '@emotion/styled';

import CalendarWeekDayLabel from './CalendarWeekDayLabel';
import type HeadlessWeek from './HeadlessWeek';

export type WeekNameLabelFormat = 'short' | 'long' | 'narrow';
export interface CalendarToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly week: HeadlessWeek;
  readonly format: WeekNameLabelFormat;
  readonly locale?: string;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CalendarWeekDaysBar: React.ForwardRefRenderFunction<HTMLDivElement, CalendarToolbarProps> = (
  props,
  ref,
) => {
  const { locale, week, format, ...restProps } = props;

  return (
    <Container {...restProps} ref={ref}>
      {week.getDays().map(day => (
        <CalendarWeekDayLabel key={day.getDate().getTime().toString()}>
          {new Intl.DateTimeFormat(locale, {
            weekday: format,
          }).format(day.getDate())}
        </CalendarWeekDayLabel>
      ))}
    </Container>
  );
};

export default React.forwardRef(CalendarWeekDaysBar);
