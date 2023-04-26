import * as React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import ArrowIcon from 'mdi-react/ChevronRightIcon';

const Item = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: 1em ${({ theme }) => theme.grid.frameGutter}px;
  color: ${({ theme }) => theme.colors.text.default};
  transition: all 120ms ease-out 0s;
  border: 2px solid transparent;
  outline: none;
`;

const Icon = styled.span`
  margin-right: 0.5em;
`;

const Label = styled.span`
  flex: 1;
`;

const Badge = styled.span``;

const Arrow = styled(ArrowIcon)``;

export interface SidebarItemProps {
  location: string;
  label: React.ReactNode;
  icon: JSX.Element;
  badge?: number;
  isActive?: boolean;
}

export const SidebarItem: React.ForwardRefRenderFunction<HTMLAnchorElement, SidebarItemProps> = (
  props,
  ref,
) => {
  const { label, location, icon, badge } = props;

  return (
    <Item {...props} ref={ref} to={location}>
      <Icon>{icon}</Icon>
      <Label>{label}</Label>
      {typeof badge === 'number' && badge > 0 && <Badge>{label}</Badge>}
      {typeof badge === 'undefined' && <Arrow size="1em" />}
    </Item>
  );
};

export default React.forwardRef(SidebarItem);
