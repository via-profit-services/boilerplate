import * as React from 'react';
import styled from '@emotion/styled';
import { matchPath, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import ButtonBase from '@via-profit/ui-kit/Button/ButtonBase';
import ShopMarkerIcon from '~/components/Icons/AppsOutline';
import MainSidebarSubitem from './MainSidebarSubitem';
import MainSidebarItem from './MainSidebarItem';
import Logo from '~/components/Logo';
import MenuIcon from '~/components/Icons/MenuIcon';
import ThemeModeSwitcher from '~/components/MainSidebar/ThemeModeSwitcher';

import { Sidebar, SidebarHeader, SidebarFooter } from '~/components/Sidebar';

const SidebarContainer = styled(Sidebar)`
  height: 100vh;
  width: 13rem;
`;

const Nav = styled.nav`
  flex: 1;
  position: sticky;
  top: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-top: 1em;
`;

const AppLogo = styled(Logo)`
  font-size: 1.4em;
`;

const ToggleButton = styled(ButtonBase)``;

export type MainSidebarProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const MainSidebar: React.ForwardRefRenderFunction<HTMLDivElement, MainSidebarProps> = (
  props,
  ref,
) => {
  const { pathname } = useLocation();

  return (
    <SidebarContainer position="left" {...props} ref={ref}>
      <SidebarHeader>
        <AppLogo variant="inline" />
        <ToggleButton>
          <MenuIcon />
        </ToggleButton>
      </SidebarHeader>
      <Nav>
        <MainSidebarItem
          location="/"
          icon={<ShopMarkerIcon />}
          isActive={pathname === '/'}
          label={<FormattedMessage defaultMessage="Рабочий стол" />}
        />
        <MainSidebarItem
          icon={<ShopMarkerIcon />}
          isActive={matchPath('/pages/*', pathname) !== null}
          label={<FormattedMessage defaultMessage="Разделы сайта" />}
        >
          <MainSidebarSubitem
            location="/pages/list"
            isActive={matchPath('/pages/list/*', pathname) !== null}
            label={<FormattedMessage defaultMessage="Все" />}
          />
        </MainSidebarItem>

        <MainSidebarItem
          icon={<ShopMarkerIcon />}
          isActive={matchPath('/clients/*', pathname) !== null}
          label={<FormattedMessage defaultMessage="Клиенты" />}
        >
          <MainSidebarSubitem
            location="/clients/list/all"
            isActive={matchPath('/clients/list/all/*', pathname) !== null}
            label={<FormattedMessage defaultMessage="Все" />}
          />
          <MainSidebarSubitem
            location="/clients/list/active"
            isActive={matchPath('/clients/list/active/*', pathname) !== null}
            label={<FormattedMessage defaultMessage="Действующие" />}
          />
          <MainSidebarSubitem
            location="/clients/list/inactive"
            isActive={matchPath('/clients/list/inactive/*', pathname) !== null}
            label={<FormattedMessage defaultMessage="Не действующие" />}
          />
        </MainSidebarItem>

        <MainSidebarItem
          location="/orders/list"
          icon={<ShopMarkerIcon />}
          isActive={matchPath('/orders/*', pathname) !== null}
          label={<FormattedMessage defaultMessage="Заявки" />}
        />
        <MainSidebarItem
          icon={<ShopMarkerIcon />}
          isActive={matchPath('/users/*', pathname) !== null}
          label={<FormattedMessage defaultMessage="Пользователи" />}
        >
          <MainSidebarSubitem
            label={<FormattedMessage defaultMessage="Все" />}
            location="/users/list"
            isActive={matchPath('/users/list/*', pathname) !== null}
          />
        </MainSidebarItem>
      </Nav>
      <SidebarFooter>
        <ThemeModeSwitcher />
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default React.forwardRef(MainSidebar);
