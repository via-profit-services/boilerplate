import React from 'react';
import styled from '@emotion/styled';
import { ClassNames, css } from '@emotion/react';
import { Link, useMatch } from 'react-router-dom';
import { usePopper } from 'react-popper';

import IconChevronDown from '~/components/Icons/IconChevronDown';
import DropDownMenu from '~/components/HeaderMenu/DropDownMenu';
import DropdownItem from '~/components/HeaderMenu/DropdownItem';
import { HeaderMenuFragment$data } from '~/relay/artifacts/HeaderMenuFragment.graphql';

export type ItemLevel1 = NonNullable<NonNullable<HeaderMenuFragment$data['items']>>[0];

export interface RootItemProps extends React.HTMLAttributes<HTMLLIElement> {
  readonly item: ItemLevel1;
}

const MenuItem = styled.li`
  position: relative;
`;

const ItemLink = styled(Link)`
  padding: 0.8em 0.8em;
  color: #333;
  text-decoration: none;
  display: flex;
  flex: 1;
  align-items: center;
  transition: color 120ms ease-out;
  &:hover {
    color: rgba(240, 0, 0, 0.432);
  }
`;

const itemStyleActive = css`
  color: rgba(240, 0, 0, 0.432);
  &:hover {
    color: rgba(240, 0, 0, 0.432);
  }
`;

const AngleIcon = styled(IconChevronDown)`
  margin-left: 0.3em;
  margin-top: 0.4em;
  font-size: 0.7em;
`;

const RootItem: React.ForwardRefRenderFunction<HTMLLIElement, RootItemProps> = (props, ref) => {
  const { item, ...otherProps } = props;
  const { url, page, target, childs, name } = item;
  const isMatch = useMatch(`${page?.path}/*`);
  const [referenceElement, setReferenceElement] = React.useState<HTMLAnchorElement | null>(null);
  const [popperElement, setPopperElement] = React.useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['bottom-start', 'bottom-end'],
        },
      },
    ],
  });

  const targetValue = React.useMemo(() => {
    switch (target) {
      case 'BLANK':
        return '_blank';

      case 'SELF':
      default:
        return '_self';
    }
  }, [target]);

  const mouseOverEvent: React.MouseEventHandler<HTMLLIElement> = () => {
    setDropdownOpen(true);
  };

  const mouseLeaveEvent: React.MouseEventHandler<HTMLLIElement> = () => {
    setDropdownOpen(false);
  };

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = () => {
    setDropdownOpen(false);
  };

  return (
    <MenuItem {...otherProps} ref={ref} onMouseOver={mouseOverEvent} onMouseLeave={mouseLeaveEvent}>
      <ClassNames>
        {({ css }) => (
          <ItemLink
            ref={setReferenceElement}
            to={url || page?.path || '/'}
            target={targetValue}
            onClick={handleClick}
            className={css`
              ${isMatch !== null && itemStyleActive}
            `}
          >
            <span>{name || page?.name}</span>
            {childs && childs.length && <AngleIcon />}
          </ItemLink>
        )}
      </ClassNames>

      {childs && childs.length && (
        <div style={styles.popper} {...attributes.popper} ref={setPopperElement}>
          <DropDownMenu open={dropdownOpen}>
            {childs.map(childItem => (
              <DropdownItem key={childItem.id} item={childItem} />
            ))}
          </DropDownMenu>
        </div>
      )}
    </MenuItem>
  );
};

export default React.forwardRef(RootItem);
