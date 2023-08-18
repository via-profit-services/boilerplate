import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GlobalStyles from './GlobalStyles';
import ThemeProvider from '~/providers/ThemeProvider';
import LocaleProvider from '~/providers/LocaleProvider';

const FallbackTemplate: React.FC = () => (
  <>
    <LocaleProvider>
      <Helmet defaultTitle=" ">
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <ThemeProvider>
        <GlobalStyles />
        <Outlet />
        <ToastContainer />
      </ThemeProvider>
    </LocaleProvider>
  </>
);

export default FallbackTemplate;
