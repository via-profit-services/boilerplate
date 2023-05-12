import React from 'react';
import styled from '@emotion/styled';
import { FormattedDate } from 'react-intl';

import IconChevronRight from '~/components/Icons/IconChevronRight';
import IconChevronLeft from '~/components/Icons/IconChevronLeft';
import ErrorBoundary from '~/components/ErrorBoundary';
import Button from '~/components/Button';
import H3 from '~/components/Typography/H3';
import { Calendar } from '~/components/DatePicker';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Calendars: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selected, setSelected] = React.useState([new Date()]);

  return (
    <ErrorBoundary>
      <Section>
        <H3>
          <FormattedDate value={currentDate} month="long" year="numeric" />
        </H3>

        <Calendar
          locale="ru-RU"
          date={currentDate}
          onDateChange={setCurrentDate}
          onSelectDate={d => setSelected([d])}
          selected={selected}
        />
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
        </div>
      </Section>
    </ErrorBoundary>
  );
};

export default Calendars;
