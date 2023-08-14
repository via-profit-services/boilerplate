import * as React from 'react';
import styled from '@emotion/styled';
import { PreloadedQuery, useQueryLoader, usePreloadedQuery, useFragment } from 'react-relay';

import ShopMarkerIcon from '~/components/Icons/AppsOutline';
import PersonBlock from '~/components/Sidebar/PersonBlock';
import FooterBlock from '~/components/Sidebar/FooterBlock';
import SidebarItem from '~/components/Sidebar/SidebarItem';
import query, { AdminPanelTemplateQuery } from '~/relay/artifacts/AdminPanelTemplateQuery.graphql';
import fragmentInput, {
  PersonBlockFragment$key,
} from '~/relay/artifacts/PersonBlockFragment.graphql';

const Aside = styled.aside`
  display: flex;
  flex-flow: column;
  width: 15rem;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.mainDrawer};
`;

const Nav = styled.nav`
  flex: 1;
  position: sticky;
  top: 0;
  overflow-y: auto;
  overflow-y: auto;
`;

export type SidebarProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const Sidebar: React.ForwardRefRenderFunction<HTMLDivElement, SidebarProps> = (props, ref) => {
  const [preloadedQuery, loadQuery] = useQueryLoader<AdminPanelTemplateQuery>(query);

  React.useEffect(() => {
    if (!preloadedQuery) {
      loadQuery({});
    }
  }, [loadQuery, preloadedQuery]);

  return (
    <Aside {...props} ref={ref}>
      <React.Suspense fallback={<PersonBlock name="..." roles={[]} />}>
        {preloadedQuery && <RenderPersonBlock preloadedQuery={preloadedQuery} />}
      </React.Suspense>
      <Nav>
        <SidebarItem label="Dashboard" location="/dashboard" icon={<ShopMarkerIcon />} />
        <SidebarItem label="Users list" location="/users/list" icon={<ShopMarkerIcon />} />
        <SidebarItem label="Pages list" location="/pages/list" icon={<ShopMarkerIcon />} />
      </Nav>
      <FooterBlock />
    </Aside>
  );
};

const RenderPersonBlock: React.FC<{
  readonly preloadedQuery: PreloadedQuery<AdminPanelTemplateQuery>;
}> = props => {
  const { preloadedQuery } = props;
  const fragmentRef = usePreloadedQuery<AdminPanelTemplateQuery>(query, preloadedQuery);
  const { me } = useFragment<PersonBlockFragment$key>(fragmentInput, fragmentRef);

  if (me.__typename === 'User') {
    const { name, account } = me;

    return <PersonBlock name={name} roles={account?.roles || []} />;
  }

  return null;
};

export default React.forwardRef(Sidebar);
