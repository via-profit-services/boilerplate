import * as React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

export interface MainSidebarSubitemProps {
  readonly location: string;
  readonly label: React.ReactNode;
  readonly badge?: number;
  readonly isActive?: boolean;
}

type ItemProps = {
  readonly $active: boolean;
};

const Label = styled.span`
  position: relative;
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 3}em;
  padding: 0.2em 0.5em;
  margin-left: 0.5em;
`;

const Item = styled.button<ItemProps>`
  display: flex;
  background: none;
  cursor: pointer;
  border: none;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  padding: 0.6em 0.5em;
  color: ${({ theme, $active }) =>
    $active
      ? theme.color.accentPrimary.darken(50).toString()
      : theme.color.textSecondary.toString()};
  transition: all 120ms ease-out 0s;
  box-shadow: none;
  position: relative;
  display: inline-flex;
  &:hover {
    background: none;
    color: ${({ theme, $active }) =>
      $active
        ? theme.color.accentPrimary.darken(30).toString()
        : theme.color.accentPrimary.lighten(10).toString()};
  }
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: ${({ theme }) => theme.color.textSecondary.alpha(0.3).toString()};
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 1em;
    height: 1px;
    background-color: ${({ theme }) => theme.color.textSecondary.alpha(0.3).toString()};
  }

  ${Label} {
    background-color: ${({ theme, $active }) =>
      $active ? theme.color.accentPrimary.alpha(0.1).toString() : 'transparent'};
    color: ${({ theme, $active }) =>
      $active
        ? theme.color.accentPrimary.darken(30).toString()
        : theme.color.textSecondary.toString()};
  }

  &:hover ${Label} {
    color: ${({ theme, $active }) =>
      $active
        ? theme.color.accentPrimary.darken(30).toString()
        : theme.color.accentPrimary.lighten(20).toString()};
  }
`;

const Badge = styled.span``;

export const MainSidebarSubitem: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  MainSidebarSubitemProps
> = (props, ref) => {
  const { label, location, badge, isActive, ...restProps } = props;
  const navigate = useNavigate();

  return (
    <>
      <Item {...restProps} onClick={() => navigate(location)} ref={ref} $active={Boolean(isActive)}>
        <Label>{label}</Label>
        {typeof badge === 'number' && badge > 0 && <Badge>{label}</Badge>}
        {/* {typeof badge === 'undefined' && <Arrow size="1em" />} */}
      </Item>
    </>
  );
};

export default React.forwardRef(MainSidebarSubitem);
