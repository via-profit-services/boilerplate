import React from 'react';

import useCalendar from './use-calendar';
import CalendarCell from './CalendarCell';
import CalendarEmptyCell from './CalendarEmptyCell';
import CalendarPaper from './CalendarPaper';
import CalendarWeekRow from './CalendarWeekRow';
import CalendarDateContainer from './CalendarDateContainer';
import CalendarToolbar from './CalendarToolbar';

export interface CalendarProps {
  readonly date: Date;
  readonly locale?: string;
  readonly selected?: Date[];
  readonly onSelectDate?: (date: Date) => void;
  readonly onDateChange?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = props => {
  const { date, locale, selected, onDateChange, onSelectDate } = props;
  const [selectedDates, setSelectedDates] = React.useState<Date[]>(selected || []);
  const [currentDate, setCurrentDate] = React.useState(date);
  const currentDateRef = React.useRef(currentDate);
  const { weeks, isSameDay } = useCalendar({ date: currentDate, startDay: 'monday' });

  React.useEffect(() => {
    if (!isSameDay(currentDateRef.current, date)) {
      currentDateRef.current = date;
      setCurrentDate(date);
    }
  }, [date, isSameDay]);

  React.useEffect(() => {
    setSelectedDates(selected || []);
  }, [selected]);

  return (
    <CalendarPaper>
      <CalendarToolbar
        date={currentDate}
        locale={locale}
        onDateChange={newDate => {
          setCurrentDate(newDate);
          if (typeof onDateChange === 'function') {
            onDateChange(newDate);
          }
        }}
      />
      <CalendarDateContainer>
        {weeks.map(week => (
          <CalendarWeekRow key={week.getWeekNumber().toString()}>
            {week.getDays().map(day => {
              if (day.getDate().getMonth() === currentDate.getMonth()) {
                return (
                  <CalendarCell
                    key={day.getDate().getTime()}
                    isToday={day.isToday()}
                    isSelected={selectedDates.find(s => isSameDay(s, day.getDate())) !== undefined}
                    onClick={() =>
                      typeof onSelectDate === 'function' ? onSelectDate(day.getDate()) : void 0
                    }
                  >
                    {day.getLabel()}
                  </CalendarCell>
                );
              }

              return <CalendarEmptyCell key={day.getDate().getTime()} />;
            })}
          </CalendarWeekRow>
        ))}
      </CalendarDateContainer>
    </CalendarPaper>
  );
};

export default React.memo(Calendar);
