import React from 'react';

// import HeadlessWeek from './HeadlessWeek';
// import HeadlessDay, { HeadlessDayProps } from './HeadlessDay';

export type WeekDayName =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type Day = {
  readonly date: Date;
  readonly isToday: boolean;
  readonly isDisabled: boolean;
};

export type Week = {
  readonly weekNumber: number;
  readonly days: Day[];
};

export interface UseCalendarProps {
  readonly date?: Date;
  readonly minDate?: Date;
  readonly maxDate?: Date;
  readonly locale?: string;
  readonly weekStartDay?: WeekDayName;
  readonly displayLeadingZero?: boolean;
}

// export interface UseCalendarPayload {
//   readonly isSameDay: (a: Date, b: Date) => boolean;
//   readonly isToday: (dateValue: Date) => boolean;
//   readonly minDate: Date;
//   readonly maxDate: Date;
//   readonly weeks: Week[];
//   readonly weekStartDay: WeekDayName;
//   readonly locale: string;
//   readonly displayLeadingZero: boolean;
// }

export const useCalendar = (props: UseCalendarProps) => {
  const [calendarDate, setCalendarDate] = React.useState(() => {
    const date = props.date instanceof Date ? props.date : new Date();

    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  });
  const [minDate, setMinDate] = React.useState(
    props.minDate || new Date(calendarDate.getFullYear() - 100, 0, 1),
  );
  const [maxDate, setMaxDate] = React.useState(
    props.maxDate || new Date(calendarDate.getFullYear() + 100, 11, 31),
  );
  const [weekStartDay, setWeekStartDay] = React.useState(props.weekStartDay || 'monday');
  const [locale, setLocale] = React.useState(props.locale || 'ru-RU');
  const [displayLeadingZero, setDisplayLeadingZero] = React.useState(
    Boolean(props.displayLeadingZero),
  );

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

  const isDisabled = React.useCallback(
    (dateValue: Date) => {
      const min = minDate.getTime() || 0;
      const max = maxDate.getTime() || Number.MAX_VALUE;
      const current = dateValue.getTime();

      return current > max || current < min;
    },
    [maxDate, minDate],
  );

  const calculateWeekNumber = React.useCallback((dt: Date) => {
    const tdt = new Date(dt.valueOf());
    const dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);

    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
    }

    return 1 + Math.ceil((firstThursday - tdt.getTime()) / 604800000);
  }, []);

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

  const weeks = React.useMemo(() => {
    const list: Week[] = [];
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

    const startDayNum = weekDaysMap[weekStartDay as WeekDayName];

    const week = new Set<Date>();
    const date = new Date(calendarDate);

    for (let dateNum = 1; dateNum < lastOfDate.getDate() + 1; dateNum++) {
      date.setDate(dateNum);

      // if is start of the week then set a new week
      if (date.getDay() === startDayNum) {
        const days: Day[] = [...week].map(day => ({
          date: day,
          isToday: isToday(day),
          isDisabled: isDisabled(day),
        }));
        if (days.length) {
          list.push({
            weekNumber: calculateWeekNumber(days[0].date),
            days,
          });
        }
        week.clear();
      }

      week.add(new Date(date));

      // if is last of iteration
      if (dateNum === lastOfDate.getDate()) {
        const days: Day[] = [...week].map(day => ({
          date: day,
          isToday: isToday(day),
          isDisabled: isDisabled(day),
        }));

        if (days.length) {
          list.push({
            weekNumber: calculateWeekNumber(days[0].date),
            days,
          });
        }

        week.clear();
      }
    }

    // Fill the prev days
    if (list[0].days.length < 7) {
      const fillDays = 7 - list[0].days.length;
      const days = list[0].days;
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
        days.unshift({
          date: day,
          isDisabled: isDisabled(day),
          isToday: isToday(day),
        });
      }
      list[0] = {
        days,
        weekNumber: calculateWeekNumber(days[0].date),
      };
    }

    // fill the next days
    if (list[list.length - 1].days.length < 7) {
      const fillDays = 7 - list[list.length - 1].days.length;
      const days = list[list.length - 1].days;
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
        days.push({
          date: day,
          isDisabled: isDisabled(day),
          isToday: isToday(day),
        });
      }
      list[list.length - 1] = {
        days,
        weekNumber: calculateWeekNumber(days[0].date),
      };
    }

    // if weeks length is 4 only
    // then prepend week
    if (list.length === 4) {
      const fillDays = 7;
      const days: Day[] = [];
      const firstWeek = list[0];
      const firstDate = firstWeek.days[0].date;

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
        days.unshift({ date: day, isDisabled: isDisabled(day), isToday: isToday(day) });
      }
      list.unshift({
        days,
        weekNumber: calculateWeekNumber(days[0].date),
      });
    }

    // if weeks length is 5 only
    // then append week
    if (list.length === 5) {
      const lastWeek = list[list.length - 1];
      const lastDate = lastWeek.days[lastWeek.days.length - 1].date;
      const days: Day[] = [];
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
        days.push({ date: day, isDisabled: isDisabled(day), isToday: isToday(day) });
      }
      list.push({
        days,
        weekNumber: calculateWeekNumber(days[0].date),
      });
    }

    return list;
  }, [calendarDate, weekDaysMap, weekStartDay, isToday, isDisabled, calculateWeekNumber]);

  return {
    isSameDay,
    isToday,
    minDate,
    setMinDate,
    maxDate,
    setMaxDate,
    weeks,
    weekStartDay,
    setWeekStartDay,
    locale,
    setLocale,
    displayLeadingZero,
    setDisplayLeadingZero,
    calendarDate,
    setCalendarDate,
  };
};

export default useCalendar;
