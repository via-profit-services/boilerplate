import React from "react";
import styled from "@emotion/styled";
import Color from "color";

import IconPrev from "./IconChevronLeft";
import IconNext from "./IconChevronRight";

export interface CalendarMonthControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly displayIcon: "prev" | "next";
}

const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  width: 2.25em;
  height: 2.25em;
  padding: 0;
  margin: 0;
  min-width: 0;
  outline: none;
  cursor: pointer;
  border: 1px solid transparent;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 3}em;
  color: ${({ theme }) => theme.colors.textPrimary};
  &:hover {
    background-color: ${({ theme }) =>
      Color(theme.colors.backgroundPrimary).darken(0.1).rgb().string()};
  }
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.accentPrimary};
  }
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

const CalendarMonthControl: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  CalendarMonthControlProps
> = (props, ref) => {
  const { displayIcon, ...restProps } = props;

  return (
    <Btn type="button" {...restProps} ref={ref}>
      {displayIcon === "next" ? <IconNext /> : <IconPrev />}
    </Btn>
  );
};

export default React.memo(React.forwardRef(CalendarMonthControl));
