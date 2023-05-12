import React from 'react';

import useCalendar, { WeekDayName } from './use-calendar';
import CalendarCell from './CalendarCell';
import CalendarEmptyCell from './CalendarEmptyCell';
import CalendarPaper from './CalendarPaper';
import CalendarWeekRow from './CalendarWeekRow';
import CalendarDateContainer from './CalendarDateContainer';
import CalendarToolbar from './CalendarToolbar';
import CalendarWeekDaysBar, { WeekNameLabelFormat } from './CalendarWeekDaysBar';

export interface CalendarProps {
  readonly date: Date;
  readonly locale?: string;
  readonly selected?: Date[];
  readonly onSelectDate?: (date: Date) => void;
  readonly onDateChange?: (date: Date) => void;
  readonly maxDate?: Date;
  readonly minDate?: Date;
  readonly weekStartDay?: WeekDayName;
  readonly weekDayLabelFormat?: WeekNameLabelFormat;
}

const Calendar: React.FC<CalendarProps> = props => {
  const {
    date,
    locale,
    selected,
    maxDate,
    minDate,
    weekStartDay,
    weekDayLabelFormat,
    onDateChange,
    onSelectDate,
  } = props;
  const [selectedDates, setSelectedDates] = React.useState<Date[]>(selected || []);
  const [currentDate, setCurrentDate] = React.useState(date);
  const currentDateRef = React.useRef(currentDate);
  const calendar = useCalendar({
    weekStartDay,
    date: currentDate,
    minDate,
    maxDate,
    locale,
  });

  React.useEffect(() => {
    if (!calendar.isSameDay(currentDateRef.current, date)) {
      currentDateRef.current = date;
      setCurrentDate(date);
    }
  }, [date, calendar]);

  React.useEffect(() => {
    setSelectedDates(selected || []);
  }, [selected]);

  return (
    <CalendarPaper>
      <CalendarToolbar
        date={currentDate}
        locale={calendar.locale}
        onDateChange={newDate => {
          setCurrentDate(newDate);
          if (typeof onDateChange === 'function') {
            onDateChange(newDate);
          }
        }}
      />
      <CalendarWeekDaysBar
        locale={calendar.locale}
        week={calendar.weeks[0]}
        format={weekDayLabelFormat || 'short'}
      />
      <CalendarDateContainer>
        {calendar.weeks.map(week => (
          <CalendarWeekRow key={week.getWeekNumber().toString()}>
            {week.getDays().map(day => {
              if (day.getDate().getMonth() === currentDate.getMonth()) {
                return (
                  <CalendarCell
                    key={day.getDate().getTime()}
                    isToday={day.isToday()}
                    isSelected={
                      selectedDates.find(s => calendar.isSameDay(s, day.getDate())) !== undefined
                    }
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
