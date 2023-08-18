import * as React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

import Header from '~/components/Header';
import MainSidebar from '~/components/MainSidebar';
import BaseTemplate from '~/templates/BaseTemplate';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;

const Main = styled.div`
  flex: 1;
`;

const Content = styled.div`
  overflow: auto;
  position: relative;
  top: 3rem;
  height: calc(100vh - 3rem);
`;

export type AdminTemplateProps = {
  readonly children?: React.ReactNode | readonly React.ReactNode[];
};

/**
 * Administrative panel template.\
 * If you pass the children property, then the children will be placed in the body of the template.\
 * Otherwise, there will be an `<Outlet>` component of `react-router-dom` renderer in the template body.
 */
const AdminTemplate: React.FC<AdminTemplateProps> = props => {
  const { children } = props;

  return (
    <BaseTemplate>
      <MainSidebar />
      <Main>
        <Header />
        <Content>{typeof children !== 'undefined' ? children : <Outlet />}</Content>
      </Main>
    </BaseTemplate>
  );
};

export default AdminTemplate;
