import * as React from 'react';
import styled from '@emotion/styled';

import ArrowIcon from '~/components/Icons/ArrowRightOutline';
import { useNavigate } from 'react-router-dom';

export interface MainSidebarItemProps {
  readonly label: React.ReactNode;
  readonly icon: JSX.Element;
  readonly badge?: number;
  readonly isActive?: boolean;
  readonly location?: string;
  readonly children?: React.ReactNode | readonly React.ReactNode[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChildWrapper = styled.div<{ $expand: boolean; $maxHeight: number }>`
  display: flex;
  flex-direction: column;
  padding-left: 1.6em;
  overflow: hidden;
  height: ${({ $expand, $maxHeight }) => ($expand ? `${$maxHeight}px` : '0')};
  transition: height 300ms cubic-bezier(0.1, 0.87, 0.22, 1);
`;

const ChildContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > *:last-of-type:before {
    bottom: 50%;
  }
`;

type ArrowIconContainerProps = {
  readonly $expand: boolean;
  readonly $active: boolean;
};

const ArrowIconContainer = styled.span<ArrowIconContainerProps>`
  background-color: ${({ theme }) => theme.color.surface.toString()};
  font-size: 1.2em;
  width: 1.5em;
  height: 1.5em;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transform: rotateZ(${({ $expand }) => ($expand ? '90deg' : '0deg')});
  transition: transform 320ms cubic-bezier(0.1, 0.87, 0.22, 1);
`;

const Button = styled.button<ArrowIconContainerProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  border: none;
  background: none;
  min-height: 3.8em;
  justify-content: space-between;
  padding: 1em 1.5em;
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
    position: absolute;
    content: '';
    inset: 0.3em 0.4em 0.3em 0;
    border-radius: ${({ theme }) =>
      `0 ${theme.shape.radiusFactor * 3}em ${theme.shape.radiusFactor * 4}em 0`};
    background-color: ${({ theme, $active }) =>
      $active ? theme.color.accentPrimary.alpha(0.1).toString() : 'transparent'};
  }
  &:hover:before {
    background-color: ${({ theme, $active }) =>
      $active
        ? theme.color.accentPrimary.alpha(0.1).toString()
        : theme.color.textSecondary.alpha(0.05).toString()};
  }
`;

const Icon = styled.span`
  margin-right: 0.9em;
  position: relative;
`;

const Label = styled.span`
  flex: 1;
  position: relative;
  text-align: left;
`;

const Badge = styled.span``;

export const MainSidebarItem: React.ForwardRefRenderFunction<
  HTMLDivElement,
  MainSidebarItemProps
> = (props, ref) => {
  const { label, icon, badge, isActive, children, location, ...restProps } = props;
  const navigate = useNavigate();
  const [expand, setExpand] = React.useState(false);
  const childRef = React.useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = React.useState(0);
  const isCollapsable = React.useMemo(
    () => typeof children !== 'undefined' && typeof location === 'undefined',
    [children, location],
  );

  React.useEffect(() => {
    if (childRef.current) {
      const height = childRef.current.getBoundingClientRect().height;
      if (height !== maxHeight) {
        setMaxHeight(height);
      }
    }
  }, [maxHeight]);

  return (
    <Container {...restProps} ref={ref}>
      <Button
        type="button"
        {...restProps}
        $expand={expand}
        $active={Boolean(isActive)}
        onClick={() => {
          if (isCollapsable) {
            setExpand(ex => !ex);
          }

          if (!isCollapsable && location) {
            navigate(location);
          }
        }}
      >
        <Icon>{icon}</Icon>
        <Label>{label}</Label>
        {typeof badge === 'number' && badge > 0 && <Badge>{label}</Badge>}

        {isCollapsable && (
          <ArrowIconContainer $expand={expand} $active={Boolean(isActive)}>
            <ArrowIcon />
          </ArrowIconContainer>
        )}
      </Button>
      {isCollapsable && (
        <ChildWrapper $expand={expand} $maxHeight={maxHeight}>
          <ChildContainer ref={childRef}>{children}</ChildContainer>
        </ChildWrapper>
      )}
    </Container>
  );
};

export default React.forwardRef(MainSidebarItem);
