import * as React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ThemeProvider from '~/providers/ThemeProvider';
import LocaleProvider from '~/providers/LocaleProvider';
import Header from '~/components/Header';
import MainSidebar from '~/components/MainSidebar';
import GlobalStyles from './GlobalStyles';

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

const AdminPanelTemplate: React.FC = () => (
  <>
    <LocaleProvider>
      <Helmet defaultTitle=" ">
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <ThemeProvider>
        <GlobalStyles />
        <Wrapper>
          <MainSidebar />
          <Main>
            <Header />
            <Content>
              <Outlet />
            </Content>
          </Main>
        </Wrapper>
        <ToastContainer />
      </ThemeProvider>
    </LocaleProvider>
  </>
);

export default AdminPanelTemplate;
