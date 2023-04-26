import React from 'react';
import styled from '@emotion/styled';
import { graphql, useFragment } from 'react-relay';

import RootItem from '~/components/HeaderMenu/RootItem';
import fragment, { HeaderMenuFragment$key } from '~/relay/artifacts/HeaderMenuFragment.graphql';

export interface HeaderMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly fragmentRef: HeaderMenuFragment$key;
}

const Nav = styled.nav`
  flex: 1;
  display: flex;
`;

const Menu = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  display: flex;
  align-items: center;
`;

const HeaderMenu: React.ForwardRefRenderFunction<HTMLUListElement, HeaderMenuProps> = (
  props,
  ref,
) => {
  const { fragmentRef, ...otherProps } = props;
  const menu = useFragment<HeaderMenuFragment$key>(fragment, fragmentRef);

  return (
    <Nav {...otherProps} ref={ref}>
      <Menu>
        {menu?.items?.map(item => (
          <RootItem key={item.id} item={item} />
        ))}
      </Menu>
    </Nav>
  );
};

export default React.forwardRef(HeaderMenu);

graphql`
  fragment HeaderMenuFragment on PageMenu {
    id
    items {
      id
      url
      name
      target
      page {
        id
        name
        path
      }
      parent {
        id
      }
      childs {
        id
        url
        name
        target
        page {
          id
          name
          path
        }
        parent {
          id
        }
        childs {
          id
          url
          name
          target
          page {
            id
            name
            path
          }
          parent {
            id
          }
        }
      }
    }
  }
`;
