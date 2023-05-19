import React from 'react';
import styled from '@emotion/styled';

export type CalendarTopBarProps = React.HTMLAttributes<HTMLDivElement>;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
`;

const CalendarTopBar: React.ForwardRefRenderFunction<HTMLDivElement, CalendarTopBarProps> = (
  props,
  ref,
) => {
  const { children, ...restProps } = props;

  return (
    <Container {...restProps} ref={ref}>
      <>{children}</>
    </Container>
  );
};

export default React.memo(React.forwardRef(CalendarTopBar));
