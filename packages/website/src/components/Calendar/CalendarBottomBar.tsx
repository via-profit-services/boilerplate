import React from 'react';
import styled from '@emotion/styled';

export type CalendarBottomBarProps = React.HTMLAttributes<HTMLDivElement>;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CalendarBottomBar: React.ForwardRefRenderFunction<HTMLDivElement, CalendarBottomBarProps> = (
  props,
  ref,
) => {
  const { children, ...restProps } = props;

  return (
    <Container {...restProps} ref={ref}>
      {children}
    </Container>
  );
};

export default React.forwardRef(CalendarBottomBar);
