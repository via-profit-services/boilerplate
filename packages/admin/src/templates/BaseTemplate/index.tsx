import * as React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ThemeProvider from '~/providers/ThemeProvider';
import LocaleProvider from '~/providers/LocaleProvider';
import GlobalStyles from './GlobalStyles';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  min-height: 100vh;
`;

export type BaseTemplateProps = {
  readonly children?: React.ReactNode | readonly React.ReactNode[];
};

/**
 * Basic template.\
 * If you pass the children property, then the children will be placed in the body of the template.\
 * Otherwise, there will be an `<Outlet>` component of `react-router-dom` renderer in the template body.
 */
const BaseTemplate: React.FC<BaseTemplateProps> = props => {
  const { children } = props;

  return (
    <LocaleProvider>
      <Helmet defaultTitle=" ">
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <ThemeProvider>
        <GlobalStyles />
        <Wrapper>{typeof children !== 'undefined' ? children : <Outlet />}</Wrapper>
        <ToastContainer />
      </ThemeProvider>
    </LocaleProvider>
  );
};

export default BaseTemplate;
