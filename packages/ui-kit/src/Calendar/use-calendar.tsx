import React from "react";

export type WeekDayName =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

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

type CalendarState = {
  readonly date: Date;
  readonly minDate: Date;
  readonly maxDate: Date;
  readonly locale: string;
  readonly weekStartDay: WeekDayName;
  readonly displayLeadingZero: boolean;
};

type CalendarActionPartial = {
  readonly type: "partial";
  readonly payload: Partial<CalendarState>;
};

type CalendarActionDate = {
  readonly type: "date";
  readonly payload: Date;
};

type CalendarActions = CalendarActionPartial | CalendarActionDate;

const calendarReducer: React.Reducer<CalendarState, CalendarActions> = (
  state,
  action
) => {
  switch (action.type) {
    case "partial":
      return {
        ...state,
        ...action.payload,
      };

    case "date": {
      return {
        ...state,
        date: action.payload,
      };
    }
    default:
      return state;
  }
};

const calendarDefaults: CalendarState = {
  date: new Date(),
  minDate: new Date(new Date().getFullYear() - 100, 0, 1, 0, 0, 0),
  maxDate: new Date(new Date().getFullYear() + 100, 0, 1, 0, 0, 0),
  locale: "ru-RU",
  weekStartDay: "monday",
  displayLeadingZero: false,
};

export const useCalendar = (props: UseCalendarProps) => {
  const [state, dispatch] = React.useReducer(calendarReducer, {
    ...calendarDefaults,
    ...props,
  });

  const { date, minDate, maxDate, locale, weekStartDay, displayLeadingZero } =
    state;

  const isSameDay = React.useCallback(
    (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate(),
    []
  );
  const isToday = React.useCallback(
    (dateValue: Date) => isSameDay(dateValue, new Date()),
    [isSameDay]
  );

  const isDisabled = React.useCallback(
    (dateValue: Date) => {
      const min = minDate.getTime() || 0;
      const max = maxDate.getTime() || Number.MAX_VALUE;
      const current = dateValue.getTime();

      return current > max || current < min;
    },
    [maxDate, minDate]
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
    []
  );

  const weeks = React.useMemo(() => {
    const list: Week[] = [];
    const startOfDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    const lastOfDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      0,
      0,
      0
    );

    const startDayNum = weekDaysMap[weekStartDay as WeekDayName];

    const week = new Set<Date>();
    const d = new Date(date);

    for (let dateNum = 1; dateNum < lastOfDate.getDate() + 1; dateNum++) {
      d.setDate(dateNum);

      // if is start of the week then set a new week
      if (d.getDay() === startDayNum) {
        const days: Day[] = [...week].map((day) => ({
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

      week.add(new Date(d));

      // if is last of iteration
      if (dateNum === lastOfDate.getDate()) {
        const days: Day[] = [...week].map((day) => ({
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
          0
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
          0
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
          0
        );
        days.unshift({
          date: day,
          isDisabled: isDisabled(day),
          isToday: isToday(day),
        });
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
          0
        );
        days.push({
          date: day,
          isDisabled: isDisabled(day),
          isToday: isToday(day),
        });
      }
      list.push({
        days,
        weekNumber: calculateWeekNumber(days[0].date),
      });
    }

    return list;
  }, [
    date,
    weekDaysMap,
    weekStartDay,
    isToday,
    isDisabled,
    calculateWeekNumber,
  ]);

  const setDate = React.useCallback((value: Date) => {
    dispatch({
      type: "date",
      payload: value,
    });
  }, []);

  return {
    isSameDay,
    isToday,
    setDate,
    dispatch,
    minDate,
    maxDate,
    weeks,
    weekStartDay,
    locale,
    displayLeadingZero,
    date,
  };
};

export default useCalendar;
