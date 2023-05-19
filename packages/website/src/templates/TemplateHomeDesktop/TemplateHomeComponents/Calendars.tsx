import React from 'react';
import styled from '@emotion/styled';
import { FormattedDate } from 'react-intl';

import IconChevronRight from '~/components/Icons/IconChevronRight';
import IconChevronLeft from '~/components/Icons/IconChevronLeft';
import ErrorBoundary from '~/components/ErrorBoundary';
import Button from '~/components/Button';
import H3 from '~/components/Typography/H3';
import Calendar, { WeekDayName } from '~/components/Calendar';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Calendars: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selected, setSelected] = React.useState([new Date()]);
  const [locale, setLocale] = React.useState('ru-RU');
  const [weekStartDay, setWeekStartDay] = React.useState<WeekDayName>('monday');

  return (
    <ErrorBoundary>
      <Section>
        <H3>
          <FormattedDate value={currentDate} month="long" year="numeric" />
        </H3>

        <Calendar
          locale={locale}
          displayLeadingZero={false}
          date={currentDate}
          weekStartDay={weekStartDay}
          onDateChange={d => setCurrentDate(d)}
          onSelectDate={d => setSelected([d])}
          selected={selected}
          minDate={new Date(2022, 0, 1)}
          maxDate={new Date(2023, 11, 31)}
        />
        <p>
          selected dates:{' '}
          {selected
            .map(d =>
              [
                new Intl.DateTimeFormat(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(d),
                `(${d.getTime()})`,
              ].join(' '),
            )
            .join(', ')}
        </p>
        <p>
          current date:{' '}
          {[
            new Intl.DateTimeFormat(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(currentDate),
            `(${currentDate.getTime()})`,
          ].join(' ')}
        </p>
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
        <div>
          <Button
            onClick={() => {
              const toSelect = [
                new Date(
                  currentDate.getFullYear(),
                  Math.floor(Math.random() * 11),
                  Math.floor(Math.random() * 28) + 1,
                ),
                new Date(
                  currentDate.getFullYear(),
                  Math.floor(Math.random() * 11),
                  Math.floor(Math.random() * 28) + 1,
                ),
                new Date(
                  currentDate.getFullYear(),
                  Math.floor(Math.random() * 11),
                  Math.floor(Math.random() * 28) + 1,
                ),
              ];
              setSelected(toSelect);
              setCurrentDate(toSelect[0]);
            }}
          >
            Select three dates
          </Button>
          <Button
            onClick={() => {
              const toSelect = [
                new Date(
                  currentDate.getFullYear(),
                  Math.floor(Math.random() * 11),
                  Math.floor(Math.random() * 28) + 1,
                ),
              ];
              setSelected(toSelect);
              setCurrentDate(toSelect[0]);
            }}
          >
            Select rundom date
          </Button>
          <Button
            variant="accent"
            onClick={() => {
              setCurrentDate(d => {
                const f = new Date(d);
                f.setFullYear(2010);
                f.setMonth(1);
                f.setDate(1);

                return f;
              });
            }}
          >
            2010.02.01
          </Button>
          <Button
            variant="accent"
            onClick={() => {
              setCurrentDate(new Date());
            }}
          >
            Today
          </Button>

          <Button
            variant="accent"
            onClick={() => {
              setCurrentDate(new Date(2022, 11 - 1, 1));
            }}
          >
            November, 01, 2022
          </Button>
        </div>
        <div>
          <Button
            variant="accent"
            onClick={() => {
              setLocale('ru-RU');
            }}
          >
            Local ru-RU
          </Button>
          <Button
            variant="accent"
            onClick={() => {
              setLocale('en-US');
            }}
          >
            Local en-US
          </Button>
        </div>
        <div>
          <Button
            variant="accent"
            onClick={() => {
              setWeekStartDay('monday');
            }}
          >
            Week start day is monday
          </Button>
          <Button
            variant="accent"
            onClick={() => {
              setWeekStartDay('sunday');
            }}
          >
            Week start day is sunday
          </Button>
        </div>
      </Section>
    </ErrorBoundary>
  );
};

export default Calendars;
