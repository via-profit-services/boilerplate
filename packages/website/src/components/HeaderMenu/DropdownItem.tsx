import React from 'react';
import { usePopper } from 'react-popper';
import { Link, useMatch } from 'react-router-dom';
import styled from '@emotion/styled';
import { ClassNames, css } from '@emotion/react';

import IconChevronRight from '~/components/Icons/IconChevronRight';
import DropDownMenu from '~/components/HeaderMenu/DropDownMenu';
import { HeaderMenuFragment$data } from '~/relay/artifacts/HeaderMenuFragment.graphql';

export type ItemLevel1 = NonNullable<HeaderMenuFragment$data['items']>[0];
export type ItemLevel2 = NonNullable<ItemLevel1['childs']>[0];
export type ItemLevel3 = NonNullable<ItemLevel2['childs']>[0];

export interface DropdownItemProps extends React.HTMLAttributes<HTMLLIElement> {
  readonly item: ItemLevel2 | ItemLevel3;
}

const MenuItem = styled.li`
  position: relative;
  display: flex;
  width: 100%;
`;

const ItemLink = styled(Link)`
  color: #000;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6em 0.8em;
  text-decoration: none;
  transition: background-color 120ms ease-out;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const itemStyleActive = css`
  color: rgba(240, 0, 0, 0.432);
  &:hover {
    color: rgba(240, 0, 0, 0.432);
  }
`;

const AngleIcon = styled(IconChevronRight)`
  margin-left: 0.3em;
  margin-top: 0.4em;
  font-size: 0.7em;
`;

const isItemLevel3 = (item: ItemLevel2 | ItemLevel3): item is ItemLevel2 => 'childs' in item;

const DropdownItem: React.ForwardRefRenderFunction<HTMLLIElement, DropdownItemProps> = (
  props,
  ref,
) => {
  const { item, ...otherProps } = props;
  const { url, page, name, target } = item;
  const isMatch = useMatch(`${page?.path}/*`);
  const [referenceElement, setReferenceElement] = React.useState<HTMLAnchorElement | null>(null);
  const [popperElement, setPopperElement] = React.useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'right-start',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['right-start', 'left-start'],
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
            to={url || page?.path || '/'}
            ref={setReferenceElement}
            target={targetValue}
            onClick={handleClick}
            className={css`
              ${isMatch && itemStyleActive}
            `}
          >
            <span>{name || page?.name}</span>
            {'childs' in item && item.childs?.length && <AngleIcon />}
          </ItemLink>
        )}
      </ClassNames>

      {isItemLevel3(item) && (
        <div style={styles.popper} {...attributes.popper} ref={setPopperElement}>
          <DropDownMenu open={dropdownOpen}>
            {item.childs?.map(childItem => (
              <DropdownItemRef key={childItem.id} item={childItem} />
            ))}
          </DropDownMenu>
        </div>
      )}
    </MenuItem>
  );
};

const DropdownItemRef = React.forwardRef(DropdownItem);

export default DropdownItemRef;
