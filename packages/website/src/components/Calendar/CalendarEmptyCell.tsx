import React from 'react';
import styled from '@emotion/styled';

export type CalendarEmptyCellProps = React.HTMLAttributes<HTMLButtonElement>;

const Elem = styled.span`
  font-size: 0.8em;
  width: 3em;
  height: 3em;
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

export default React.memo(React.forwardRef(CalendarEmptyCell));
