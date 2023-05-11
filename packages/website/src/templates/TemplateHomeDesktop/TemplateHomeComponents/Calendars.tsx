import React from 'react';
import styled from '@emotion/styled';
import { FormattedDate } from 'react-intl';

import IconChevronRight from '~/components/Icons/IconChevronRight';
import IconChevronLeft from '~/components/Icons/IconChevronLeft';
import ErrorBoundary from '~/components/ErrorBoundary';
import Button from '~/components/Button';
import H3 from '~/components/Typography/H3';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

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

const CalendarDay = styled.div<{ $notCurrentMonth?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
  flex: 1;
  outline: 1px solid ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ $notCurrentMonth, theme }) =>
    $notCurrentMonth ? theme.colors.backgroundSecondary : theme.colors.backgroundPrimary};
  color: ${({ $notCurrentMonth, theme }) =>
    $notCurrentMonth ? theme.colors.textSecondary : theme.colors.textPrimary};
  opacity: ${({ $notCurrentMonth }) => ($notCurrentMonth ? 0.3 : 1)};
`;

type DayName = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

class Week {
  #days: Day[] = [];
  #weekNumber: number;
  constructor(days: Day[]) {
    this.#days = days;
    this.#weekNumber = this.#calculateWeekNumber(days[0].getDate());
  }

  public getWeekNumber() {
    return this.#weekNumber;
  }

  public getDays() {
    return this.#days;
  }

  #calculateWeekNumber(dt: Date) {
    const tdt = new Date(dt.valueOf());
    const dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);

    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
    }

    return 1 + Math.ceil((firstThursday - tdt.getTime()) / 604800000);
  }
}

class Day {
  #date: Date;

  constructor(date: Date) {
    this.#date = new Date(date);
  }

  public getDate() {
    return new Date(this.#date);
  }
}

class HeadlessCalendar {
  #currentDate: Date;
  #startDay: DayName = 'monday';
  #weeks: Week[];
  constructor(currentDate: Date) {
    this.#currentDate = currentDate;
    this.#weeks = this.#fillWeeks();
  }

  public getWeeks() {
    return this.#weeks;
  }
  #getDayNumberByName(dayName: DayName): number {
    const dayNames: Record<DayName, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    return dayNames[dayName];
  }
  #fillWeeks() {
    const weeks: Week[] = [];
    const startOfDate = new Date(this.#currentDate.getFullYear(), this.#currentDate.getMonth(), 1);
    const lastOfDate = new Date(
      this.#currentDate.getFullYear(),
      this.#currentDate.getMonth() + 1,
      0,
    );

    const startDayNum = this.#getDayNumberByName(this.#startDay);
    const week = new Set<Date>();
    const date = new Date(this.#currentDate);

    for (let dateNum = 1; dateNum < lastOfDate.getDate() + 1; dateNum++) {
      date.setDate(dateNum);

      // if is start of the week then set a new week
      if (date.getDay() === startDayNum) {
        const days = [...week].map(day => new Day(day));
        if (days.length) {
          weeks.push(new Week(days));
        }
        week.clear();
      }

      week.add(new Date(date));

      // if is last of iteration
      if (dateNum === lastOfDate.getDate()) {
        const days = [...week].map(day => new Day(day));
        if (days.length) {
          weeks.push(new Week(days));
        }

        week.clear();
      }
    }

    // Fill the prev days
    if (weeks[0].getDays().length < 7) {
      const fillDays = 7 - weeks[0].getDays().length;
      const days = weeks[0].getDays();
      for (let fillIndex = 0; fillIndex < fillDays; fillIndex++) {
        days.unshift(
          new Day(new Date(startOfDate.getFullYear(), startOfDate.getMonth(), -fillIndex)),
        );
      }
      weeks[0] = new Week(days);
    }

    // fill the next days
    if (weeks[weeks.length - 1].getDays().length < 7) {
      const fillDays = 7 - weeks[weeks.length - 1].getDays().length;
      const days = weeks[weeks.length - 1].getDays();
      for (let fillIndex = 0; fillIndex < fillDays; fillIndex++) {
        days.push(
          new Day(new Date(lastOfDate.getFullYear(), lastOfDate.getMonth() + 1, fillIndex + 1)),
        );
      }
      weeks[weeks.length - 1] = new Week(days);
    }

    // if weeks length is 4 only
    // then prepend week
    if (weeks.length === 4) {
      const fillDays = 7;
      const days: Day[] = [];
      const firstWeek = weeks[0];
      const firstDate = firstWeek.getDays()[0].getDate();

      for (let fillIndex = 0; fillIndex < fillDays; fillIndex++) {
        days.unshift(
          new Day(
            new Date(
              firstDate.getFullYear(),
              firstDate.getMonth(),
              firstDate.getDate() - fillIndex,
            ),
          ),
        );
      }
      weeks.unshift(new Week(days));
    }

    // if weeks length is 5 only
    // then append week
    if (weeks.length === 5) {
      const lastWeek = weeks[weeks.length - 1];
      const lastDate = lastWeek.getDays()[lastWeek.getDays().length - 1].getDate();
      const days: Day[] = [];
      for (let fillIndex = 0; fillIndex < 7; fillIndex++) {
        days.push(
          new Day(
            new Date(
              lastDate.getFullYear(),
              lastDate.getMonth(),
              lastDate.getDate() + fillIndex + 1,
            ),
          ),
        );
      }
      const newWeek = new Week(days);
      weeks.push(newWeek);
    }

    return weeks;
  }
}

const Calendars: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const calendar = new HeadlessCalendar(currentDate);

  return (
    <ErrorBoundary>
      <Section>
        <H3>
          <FormattedDate value={currentDate} month="long" year="numeric" />
        </H3>

        <CalendarContainer>
          {calendar.getWeeks().map(week => (
            <CalendarWeek key={week.getWeekNumber().toString()}>
              {week.getDays().map(day => (
                <CalendarDay
                  key={day.getDate().getTime()}
                  $notCurrentMonth={day.getDate().getMonth() !== currentDate.getMonth()}
                >
                  <FormattedDate value={day.getDate()} day="2-digit" month="short" />
                </CalendarDay>
              ))}
            </CalendarWeek>
          ))}
        </CalendarContainer>
        <div>
          <Button
            variant="accent"
            startIcon={<IconChevronLeft />}
            onClick={() => {
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
            }}
          >
            Prev month
          </Button>
          <Button
            variant="accent"
            endIcon={<IconChevronRight />}
            onClick={() => {
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
            }}
          >
            Next month
          </Button>
        </div>
        <Button
          variant="accent"
          onClick={() => {
            setCurrentDate(new Date(2010, 1, 1));
          }}
        >
          2010.02.01
        </Button>
      </Section>
    </ErrorBoundary>
  );
};

export default Calendars;
