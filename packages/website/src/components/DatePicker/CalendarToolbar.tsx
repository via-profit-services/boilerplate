import React from 'react';
import styled from '@emotion/styled';

import CalendarMonthControl from './CalendarMonthControl';

export interface CalendarToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly date: Date;
  readonly locale?: string;
  readonly onDateChange: (date: Date) => void;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  text-align: center;
  font-weight: 600;
`;

const CalendarToolbar: React.ForwardRefRenderFunction<HTMLDivElement, CalendarToolbarProps> = (
  props,
  ref,
) => {
  const { date, locale, onDateChange, ...restProps } = props;

  const toolbarTitle = React.useMemo(() => {
    const intl = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    });

    const title = intl.format(date);

    return title.charAt(0).toUpperCase() + title.slice(1);
  }, [date, locale]);

  const handlePrevMonthChange: React.MouseEventHandler<HTMLButtonElement> = () => {
    onDateChange(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonthChange: React.MouseEventHandler<HTMLButtonElement> = () => {
    onDateChange(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <Container {...restProps} ref={ref}>
      <CalendarMonthControl displayIcon="prev" onClick={handlePrevMonthChange} />
      <Title>{toolbarTitle}</Title>
      <CalendarMonthControl displayIcon="next" onClick={handleNextMonthChange} />
    </Container>
  );
};

export default React.forwardRef(CalendarToolbar);
