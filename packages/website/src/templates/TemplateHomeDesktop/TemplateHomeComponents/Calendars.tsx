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

type Item = {
  readonly id: number;
  readonly name: string;
};

type DayName = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

class Week {
  #date: Date;
  #weekNumber: number;
  constructor(date: Date) {
    this.#date = new Date(date);
    this.#weekNumber = this.#calculateWeekNumber(this.#date);
  }

  public getWeekNumber() {
    return this.#weekNumber;
  }

  public getDate() {
    return new Date(this.#date);
  }

  #calculateWeekNumber(date: Date) {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil(
      ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7,
    );

    return week;
  }
}

class HeadlessCalendar {
  #currentDate: Date;
  #startDay: DayName = 'monday';
  #matrix: Date[][];
  constructor(currentDate: Date) {
    this.#currentDate = currentDate;
    this.#matrix = this.#buildMatrix();
  }

  public getMatrix() {
    return this.#matrix;
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
  #buildMatrix() {
    const matrix: Date[][] = [];
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
        matrix.push([...week]);
        week.clear();
      }

      week.add(new Date(date));

      // if is last of iteration
      if (dateNum === lastOfDate.getDate()) {
        matrix.push([...week]);
        week.clear();
      }
    }

    // Fill the prev days
    if (matrix[0].length < 7) {
      const fillDays = 7 - matrix[0].length;
      for (let fillIndex = 0; fillIndex < fillDays; fillIndex++) {
        matrix[0].unshift(new Date(startOfDate.getFullYear(), startOfDate.getMonth(), -fillIndex));
      }
    }

    // fill the next days
    if (matrix[matrix.length - 1].length < 7) {
      const fillDays = 7 - matrix[matrix.length - 1].length;
      for (let fillIndex = 0; fillIndex < fillDays; fillIndex++) {
        matrix[matrix.length - 1].push(
          new Date(lastOfDate.getFullYear(), lastOfDate.getMonth() + 1, fillIndex + 1),
        );
      }
    }

    // fill the empty weeks
    // if (matrix.length === 4) {
    //   const firstWeek = matrix[0];
    //   const firstDate = new Date(firstWeek[0]);
    //   const newWeek: Date[] = [];
    //   for (let fillIndex = 0; fillIndex < 7; fillIndex++) {
    //     // newWeek.unshift(
    //     //   new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, -fillIndex - 1),
    //     // );
    //     newWeek.unshift(
    //       new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() - fillIndex),
    //     );
    //   }
    //   matrix.unshift(newWeek);
    // }

    // append empty week to end
    if (matrix.length === 5) {
      const lastWeek = matrix[matrix.length - 1];
      const lastDate = new Date(lastWeek[lastWeek.length - 1]);
      const newWeek: Date[] = [];
      for (let fillIndex = 0; fillIndex < 7; fillIndex++) {
        newWeek.push(
          new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + fillIndex + 1),
        );
      }
      matrix.push(newWeek);
    }

    return matrix;
  }
}

const Calendars: React.FC = () => {
  const [selectedItems, setSelectedItems] = React.useState<readonly Item[]>([]);
  const [multiple, setMultiple] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const c = new HeadlessCalendar(currentDate);
  // console.log(c.getMatrix());

  return (
    <ErrorBoundary>
      <Section>
        <H3>
          <FormattedDate value={currentDate} month="long" year="numeric" />
        </H3>

        <CalendarContainer>
          {c.getMatrix().map((week, index) => (
            <CalendarWeek key={index.toString()}>
              {week.map(day => (
                <CalendarDay
                  key={day.getTime()}
                  $notCurrentMonth={day.getMonth() !== currentDate.getMonth()}
                >
                  <FormattedDate value={day} day="2-digit" month="short" />
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
