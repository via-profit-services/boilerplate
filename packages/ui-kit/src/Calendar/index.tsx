import React from "react";

import useCalendar, { WeekDayName } from "./use-calendar";
import CalendarCell from "./CalendarCell";
import CalendarEmptyCell from "./CalendarEmptyCell";
import CalendarPaper from "./CalendarPaper";
import CalendarWeekRow from "./CalendarWeekRow";
import CalendarDateContainer from "./CalendarDateContainer";
import CalendarTopBar from "./CalendarTopBar";
import CalendarMonthControl from "./CalendarMonthControl";
import CalendarWeekDaysBar, {
  WeekNameLabelFormat,
} from "./CalendarWeekDaysBar";
import Menu from "../Menu";
import ButtonBase from "../Button/ButtonBase";

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

export * from "./use-calendar";

const Calendar: React.FC<CalendarProps> = (props) => {
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

  const [yearsMenuEl, setYearsMenuEl] =
    React.useState<HTMLButtonElement | null>(null);

  const [monthMenuEl, setMonthMenuEl] =
    React.useState<HTMLButtonElement | null>(null);

  const [selectedDates, setSelectedDates] = React.useState<Date[]>([
    ...(selected || []),
  ]);
  const calendar = useCalendar({
    weekStartDay,
    displayLeadingZero,
    date,
    minDate,
    maxDate,
    locale,
  });

  const currentMonthLabel = React.useMemo(() => {
    const intl = new Intl.DateTimeFormat(calendar.locale, {
      month: "long",
    });

    const title = intl.format(calendar.date);

    return title.charAt(0).toUpperCase() + title.slice(1);
  }, [calendar.date, calendar.locale]);

  React.useEffect(() => {
    calendar.dispatch({
      type: "partial",
      payload: props,
    });
  }, [props]);

  // If selected props has been changed
  React.useEffect(() => {
    const prev = selectedDates;
    const next = [...(selected || [])];
    const has1 = prev.every((prevDate) =>
      next.find((nextDate) => calendar.isSameDay(prevDate, nextDate))
    );
    const has2 = next.every((nextDate) =>
      prev.find((prevDate) => calendar.isSameDay(nextDate, prevDate))
    );

    const isEqual = has1 && has2;

    if (!isEqual) {
      setSelectedDates([...(selected || [])]);
    }
  }, [selected, selectedDates]);

  const [year, month] = React.useMemo(
    () => [calendar.date.getFullYear(), calendar.date.getMonth()],
    [calendar.date]
  );

  const handlePrevClick = React.useCallback(() => {
    const d = new Date(year, month - 1, 1);

    if (!calendar.isSameDay(d, calendar.date)) {
      calendar.setDate(d);

      if (typeof onDateChange === "function") {
        onDateChange(d);
      }
    }
  }, [year, month, onDateChange]);

  const handleNextClick = React.useCallback(() => {
    const d = new Date(year, month + 1, 1);

    if (!calendar.isSameDay(d, calendar.date)) {
      calendar.setDate(d);

      if (typeof onDateChange === "function") {
        onDateChange(d);
      }
    }
  }, [year, month, onDateChange]);

  const handleDayClick = React.useCallback(
    (day: Date) => () => {
      if (typeof onSelectDate === "function") {
        onSelectDate(day);
      }
    },
    [onSelectDate]
  );

  const getDayLabel = React.useCallback(
    (day: Date) => {
      const dateNum = day.getDate();
      if (!calendar.displayLeadingZero) {
        return dateNum.toString();
      }

      const numStr = `0${dateNum}`;

      return numStr.substring(numStr.length - 2);
    },
    [calendar.displayLeadingZero]
  );

  const years = React.useMemo(() => {
    const y: number[] = [];

    for (
      let year = calendar.minDate.getFullYear();
      year >= calendar.minDate.getFullYear() &&
      year <= calendar.maxDate.getFullYear();
      year++
    ) {
      y.push(year);
    }

    return y;
  }, []);

  const monthes = React.useMemo(() => {
    const m: number[] = [];
    const y = calendar.date.getFullYear();
    for (let index = 0; index < 12; index++) {
      const d = new Date(y, index, 1, 0, 0, 0);
      if (
        d.getTime() > calendar.minDate.getTime() &&
        d.getTime() < calendar.maxDate.getTime()
      ) {
        m.push(index);
      }
    }
    return m;
  }, []);

  return (
    <CalendarPaper>
      <CalendarTopBar>
        <CalendarMonthControl displayIcon="prev" onClick={handlePrevClick} />
        <span>
          <ButtonBase
            type="button"
            onClick={(event) => setMonthMenuEl(event.currentTarget)}
          >
            {currentMonthLabel}
          </ButtonBase>
          <ButtonBase
            type="button"
            onClick={(event) => setYearsMenuEl(event.currentTarget)}
          >
            {calendar.date.getFullYear()}
          </ButtonBase>
          <Menu
            value={calendar.date.getFullYear()}
            isOpen={Boolean(yearsMenuEl)}
            anchorElement={yearsMenuEl}
            onRequestClose={() => setYearsMenuEl(null)}
            onSelectItem={(item) => {
              const newDate = new Date(calendar.date);
              newDate.setFullYear(item);
              newDate.setMonth(11 - 1);
              setYearsMenuEl(null);

              if (calendar.date.getFullYear() !== newDate.getFullYear()) {
                calendar.setDate(newDate);
                if (typeof onDateChange === "function") {
                  onDateChange(newDate);
                }
              }
            }}
            items={years}
            renderItem={(item) => item.item}
          />

          <Menu
            value={{ value: calendar.date.getMonth(), label: "month" }}
            isOpen={Boolean(monthMenuEl)}
            anchorElement={monthMenuEl}
            onRequestClose={() => setMonthMenuEl(null)}
            onSelectItem={(item) => {
              const newDate = new Date(calendar.date);
              newDate.setMonth(item.value);
              setMonthMenuEl(null);

              if (calendar.date.getMonth() !== newDate.getMonth()) {
                calendar.setDate(newDate);
                if (typeof onDateChange === "function") {
                  onDateChange(newDate);
                }
              }
            }}
            items={monthes.map((monthIndex) => {
              const intl = new Intl.DateTimeFormat(calendar.locale, {
                month: 'long'
              });

              return {
                value: monthIndex,
                label: intl.format(
                  new Date(
                    calendar.date.getFullYear(),
                    monthIndex,
                    1,
                    0,
                    0,
                    0,
                    0
                  )
                ),
              };
            })}
            renderItem={(item) => item.item.label}
          />
        </span>
        <CalendarMonthControl displayIcon="next" onClick={handleNextClick} />
      </CalendarTopBar>
      <CalendarWeekDaysBar
        locale={calendar.locale}
        week={calendar.weeks[0]}
        format={weekDayLabelFormat || "short"}
      />
      <CalendarDateContainer>
        {calendar.weeks.map((week) => (
          <CalendarWeekRow key={week.weekNumber.toString()}>
            {week.days.map((day) => {
              if (day.date.getMonth() === calendar.date.getMonth()) {
                return (
                  <CalendarCell
                    key={day.date.getTime()}
                    isToday={day.isToday}
                    isDisabled={day.isDisabled}
                    isSelected={
                      selectedDates.find((s) =>
                        calendar.isSameDay(s, day.date)
                      ) !== undefined
                    }
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
