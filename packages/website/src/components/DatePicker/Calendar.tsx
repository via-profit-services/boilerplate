import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { FormattedDate } from 'react-intl';

import useCalendar from './use-calendar';
import CalendarDay from './CalendarDay';

export interface CalendarProps {
  readonly date: Date;
}

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`;

const CalendarWeek = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
`;

const Calendar: React.FC<CalendarProps> = props => {
  const { date } = props;
  const { weeks } = useCalendar({ date, startDay: 'monday' });

  return (
    <CalendarContainer>
      {weeks.map(week => (
        <CalendarWeek key={week.getWeekNumber().toString()}>
          {week.getDays().map(day => (
            <CalendarDay
              key={day.getDate().getTime()}
              isNotCurrentMonth={day.getDate().getMonth() !== date.getMonth()}
              isToday={day.isToday()}
            >
              <FormattedDate value={day.getDate()} day="2-digit" month="short" />
            </CalendarDay>
          ))}
        </CalendarWeek>
      ))}
    </CalendarContainer>
  );
};

export default React.memo(Calendar);
