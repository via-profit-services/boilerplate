import React from 'react';
import styled from '@emotion/styled';

import { Sidebar, SidebarFooter, SidebarContent, SidebarHeader } from '~/components/Sidebar';
import FilterByLegalStatus from './FilterByLegalStatus';
import FilterByStatus from './FilterByStatus';
import Footer from './Footer';

const Cell = styled.div`
  margin-bottom: 2em;
`;

const ClientFilterSidebar: React.FC = () => (
  <Sidebar position="right">
    <SidebarHeader>Header</SidebarHeader>
    <SidebarContent>
      <Cell>
        <FilterByLegalStatus />
      </Cell>
      <Cell>
        <FilterByStatus />
      </Cell>
    </SidebarContent>
    <SidebarFooter>
      <Footer />
    </SidebarFooter>
  </Sidebar>
);

export default ClientFilterSidebar;
