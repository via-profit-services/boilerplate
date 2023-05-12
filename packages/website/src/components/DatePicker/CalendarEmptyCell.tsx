import React from 'react';
import styled from '@emotion/styled';

export type CalendarEmptyCellProps = React.HTMLAttributes<HTMLButtonElement>;

const Elem = styled.span`
  font-size: 1em;
  width: 2.25em;
  height: 2.25em;
  padding: 0;
  margin: 0;
  min-width: 0;
`;

const CalendarEmptyCell: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  CalendarEmptyCellProps
> = (props, ref) => {
  const { children, ...restProps } = props;

  return (
    <Elem {...restProps} ref={ref}>
      {children}
    </Elem>
  );
};

export default React.forwardRef(CalendarEmptyCell);
