import React from 'react';
import styled from '@emotion/styled';

import CalendarWeekDayLabel from './CalendarWeekDayLabel';
import type { Week } from './use-calendar';

export type WeekNameLabelFormat = 'short' | 'long' | 'narrow';
export interface CalendarTopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly week: Week;
  readonly format: WeekNameLabelFormat;
  readonly locale?: string;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CalendarWeekDaysBar: React.ForwardRefRenderFunction<HTMLDivElement, CalendarTopBarProps> = (
  props,
  ref,
) => {
  const { locale, week, format, ...restProps } = props;

  const weekDayLabels = React.useMemo(
    () =>
      week.days.map(day =>
        new Intl.DateTimeFormat(locale, {
          weekday: format,
        }).format(day.date),
      ),
    [format, locale, week],
  );

  return (
    <Container {...restProps} ref={ref}>
      {weekDayLabels.map(label => (
        <CalendarWeekDayLabel key={label}>{label}</CalendarWeekDayLabel>
      ))}
    </Container>
  );
};

export default React.memo(React.forwardRef(CalendarWeekDaysBar));
