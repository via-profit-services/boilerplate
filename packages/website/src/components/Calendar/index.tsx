import React from 'react';

import useCalendar, { WeekDayName } from './use-calendar';
import CalendarCell from './CalendarCell';
import CalendarEmptyCell from './CalendarEmptyCell';
import CalendarPaper from './CalendarPaper';
import CalendarWeekRow from './CalendarWeekRow';
import CalendarDateContainer from './CalendarDateContainer';
import CalendarTopBar from './CalendarTopBar';
import CalendarMonthControl from './CalendarMonthControl';
import CalendarWeekDaysBar, { WeekNameLabelFormat } from './CalendarWeekDaysBar';
import Menu from '../Menu';
import ButtonBase from '../Button/ButtonBase';

export interface CalendarProps {
  readonly date?: Date;
  readonly locale?: string;
  readonly selected?: Date[];
  readonly onSelectDate?: (date: Date) => void;
  readonly onDateChange?: (date: Date) => void;
  readonly maxDate?: Date;
  readonly minDate?: Date;
  readonly weekStartDay?: WeekDayName;
  readonly weekDayLabelFormat?: WeekNameLabelFormat;
  readonly displayLeadingZero?: boolean;
}

export * from './use-calendar';

const Calendar: React.FC<CalendarProps> = props => {
  const {
    date,
    locale,
    selected,
    maxDate,
    minDate,
    weekStartDay,
    weekDayLabelFormat,
    displayLeadingZero,
    onDateChange,
    onSelectDate,
  } = props;
  const [yearsMenuEl, setYearsMenuEl] = React.useState<HTMLButtonElement | null>(null);
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([...(selected || [])]);
  const { calendarDate, setCalendarDate, weeks } = useCalendar({
    weekStartDay,
    displayLeadingZero,
    date,
    minDate,
    maxDate,
    locale,
  });

  const isSameDay = React.useCallback(
    (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate(),
    [],
  );

  const currentMonthLabel = React.useMemo(() => {
    const intl = new Intl.DateTimeFormat(locale, {
      month: 'long',
    });

    const title = intl.format(calendarDate);

    return title.charAt(0).toUpperCase() + title.slice(1);
  }, [calendarDate, locale]);

  // If date props has been changed
  React.useEffect(() => {
    const newDate =
      date instanceof Date
        ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
        : new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0,
            0,
          );
    if (!isSameDay(calendarDate, newDate)) {
      setCalendarDate(newDate);
    }
  }, [calendarDate, date, isSameDay, setCalendarDate]);

  // If selected props has been changed
  React.useEffect(() => {
    const prev = selectedDates;
    const next = [...(selected || [])];
    const has1 = prev.every(prevDate => next.find(nextDate => isSameDay(prevDate, nextDate)));
    const has2 = next.every(nextDate => prev.find(prevDate => isSameDay(nextDate, prevDate)));

    const isEqual = has1 && has2;

    if (!isEqual) {
      setSelectedDates([...(selected || [])]);
    }
  }, [isSameDay, selected, selectedDates]);

  const [year, month] = React.useMemo(
    () => [calendarDate.getFullYear(), calendarDate.getMonth()],
    [calendarDate],
  );

  const handlePrevClick = React.useCallback(() => {
    const d = new Date(year, month - 1, 1);
    setCalendarDate(d);
    if (onDateChange) {
      onDateChange(d);
    }
  }, [year, month, setCalendarDate, onDateChange]);

  const handleNextClick = React.useCallback(() => {
    const d = new Date(year, month + 1, 1);
    setCalendarDate(d);
    if (onDateChange) {
      onDateChange(d);
    }
  }, [year, month, setCalendarDate, onDateChange]);

  const handleDayClick = React.useCallback(
    (day: Date) => () => {
      if (typeof onSelectDate === 'function') {
        onSelectDate(day);
      }
    },
    [onSelectDate],
  );

  const getDayLabel = React.useCallback(
    (day: Date) => {
      const dateNum = day.getDate();
      if (!displayLeadingZero) {
        return dateNum.toString();
      }

      const numStr = `0${dateNum}`;

      return numStr.substring(numStr.length - 2);
    },
    [displayLeadingZero],
  );

  return (
    <CalendarPaper>
      <CalendarTopBar>
        <CalendarMonthControl displayIcon="prev" onClick={handlePrevClick} />
        <span>
          <ButtonBase type="button">{currentMonthLabel}</ButtonBase>
          <ButtonBase type="button" onClick={event => setYearsMenuEl(event.currentTarget)}>
            {calendarDate.getFullYear()}
          </ButtonBase>
          <Menu
            value={calendarDate.getFullYear()}
            isOpen={Boolean(yearsMenuEl)}
            anchorElement={yearsMenuEl}
            onRequestClose={() => setYearsMenuEl(null)}
            onSelectItem={item => {
              const newDate = new Date(calendarDate);
              newDate.setFullYear(item);
              newDate.setMonth(11 - 1);
              setYearsMenuEl(null);

              setCalendarDate(newDate);
              onDateChange && onDateChange(newDate);
            }}
            items={[2020, 2021, 2022, 2023, 2024, 2025]}
            renderItem={item => item.item}
          />
        </span>
        <CalendarMonthControl displayIcon="next" onClick={handleNextClick} />
      </CalendarTopBar>
      <CalendarWeekDaysBar locale={locale} week={weeks[0]} format={weekDayLabelFormat || 'short'} />
      <CalendarDateContainer>
        {weeks.map(week => (
          <CalendarWeekRow key={week.weekNumber.toString()}>
            {week.days.map(day => {
              if (day.date.getMonth() === calendarDate.getMonth()) {
                return (
                  <CalendarCell
                    key={day.date.getTime()}
                    isToday={day.isToday}
                    isDisabled={day.isDisabled}
                    isSelected={selectedDates.find(s => isSameDay(s, day.date)) !== undefined}
                    onClick={handleDayClick(day.date)}
                  >
                    {getDayLabel(day.date)}
                  </CalendarCell>
                );
              }

              return <CalendarEmptyCell key={day.date.getTime()} />;
            })}
          </CalendarWeekRow>
        ))}
      </CalendarDateContainer>
    </CalendarPaper>
  );
};

export default React.memo(Calendar);
