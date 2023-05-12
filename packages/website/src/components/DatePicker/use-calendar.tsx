import React from 'react';

import HeadlessDayWeek from './HeadlessWeek';
import HeadlessDayDay from './HeadlessDay';

export type WeekDayName =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface UseCalendarProps {
  readonly date?: Date;
  readonly minDate?: Date;
  readonly maxDate?: Date;
  readonly locale?: string;
  readonly weekStartDay?: WeekDayName;
}

export const useCalendar = (props: UseCalendarProps) => {
  const currentLocale = React.useMemo(() => props?.locale || 'en-US', [props?.locale]);
  const [year, month] = React.useMemo(() => {
    const passedDate = props?.date || new Date();

    return [passedDate.getFullYear(), passedDate.getMonth(), passedDate.getDate()];
  }, [props?.date]);

  const isSameDay = React.useCallback(
    (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate(),
    [],
  );
  const isToday = React.useCallback(
    (dateValue: Date) => isSameDay(dateValue, new Date()),
    [isSameDay],
  );

  const weekDaysMap: Record<WeekDayName, number> = React.useMemo(
    () => ({
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    }),
    [],
  );

  const calendarDate = React.useMemo(() => new Date(year, month, 1, 0, 0, 0, 0), [year, month]);

  const weekStartDay = React.useMemo(() => props?.weekStartDay || 'monday', [props?.weekStartDay]);

  const weeks = React.useMemo(() => {
    const weeks: HeadlessDayWeek[] = [];
    const startOfDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const lastOfDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() + 1,
      0,
      0,
      0,
      0,
    );

    const startDayNum = weekDaysMap[weekStartDay];
    const week = new Set<Date>();
    const date = new Date(calendarDate);

    for (let dateNum = 1; dateNum < lastOfDate.getDate() + 1; dateNum++) {
      date.setDate(dateNum);

      // if is start of the week then set a new week
      if (date.getDay() === startDayNum) {
        const days = [...week].map(day => new HeadlessDayDay(day));
        if (days.length) {
          weeks.push(new HeadlessDayWeek(days));
        }
        week.clear();
      }

      week.add(new Date(date));

      // if is last of iteration
      if (dateNum === lastOfDate.getDate()) {
        const days = [...week].map(day => new HeadlessDayDay(day));
        if (days.length) {
          weeks.push(new HeadlessDayWeek(days));
        }

        week.clear();
      }
    }

    // Fill the prev days
    if (weeks[0].getDays().length < 7) {
      const fillDays = 7 - weeks[0].getDays().length;
      const days = weeks[0].getDays();
      for (let fillIndex = 0; fillIndex < fillDays; fillIndex++) {
        const day = new Date(
          startOfDate.getFullYear(),
          startOfDate.getMonth(),
          -fillIndex,
          0,
          0,
          0,
          0,
        );
        days.unshift(new HeadlessDayDay(day));
      }
      weeks[0] = new HeadlessDayWeek(days);
    }

    // fill the next days
    if (weeks[weeks.length - 1].getDays().length < 7) {
      const fillDays = 7 - weeks[weeks.length - 1].getDays().length;
      const days = weeks[weeks.length - 1].getDays();
      for (let fillIndex = 0; fillIndex < fillDays; fillIndex++) {
        const day = new Date(
          lastOfDate.getFullYear(),
          lastOfDate.getMonth() + 1,
          fillIndex + 1,
          0,
          0,
          0,
          0,
        );
        days.push(new HeadlessDayDay(day));
      }
      weeks[weeks.length - 1] = new HeadlessDayWeek(days);
    }

    // if weeks length is 4 only
    // then prepend week
    if (weeks.length === 4) {
      const fillDays = 7;
      const days: HeadlessDayDay[] = [];
      const firstWeek = weeks[0];
      const firstDate = firstWeek.getDays()[0].getDate();

      for (let fillIndex = 0; fillIndex < fillDays; fillIndex++) {
        const day = new Date(
          firstDate.getFullYear(),
          firstDate.getMonth(),
          firstDate.getDate() - fillIndex,
          0,
          0,
          0,
          0,
        );
        days.unshift(new HeadlessDayDay(day));
      }
      weeks.unshift(new HeadlessDayWeek(days));
    }

    // if weeks length is 5 only
    // then append week
    if (weeks.length === 5) {
      const lastWeek = weeks[weeks.length - 1];
      const lastDate = lastWeek.getDays()[lastWeek.getDays().length - 1].getDate();
      const days: HeadlessDayDay[] = [];
      for (let fillIndex = 0; fillIndex < 7; fillIndex++) {
        const day = new Date(
          lastDate.getFullYear(),
          lastDate.getMonth(),
          lastDate.getDate() + fillIndex + 1,
          0,
          0,
          0,
          0,
        );
        days.push(new HeadlessDayDay(day));
      }
      const newWeek = new HeadlessDayWeek(days);
      weeks.push(newWeek);
    }

    return weeks;
  }, [calendarDate, weekStartDay, weekDaysMap]);

  return {
    isSameDay,
    isToday,
    weekStartDay,
    weeks,
    locale: currentLocale,
  };
};

export default useCalendar;
