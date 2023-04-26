import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, ThemeProvider } from '@emotion/react';
import { IntlProvider } from 'react-intl';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from '~/themes/standardLight';
import messages from '~/translations/ru-RU.json';
import AuthForm from '~/components/AuthForm';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 214, 94, 1) 0%,
    rgba(214, 151, 4, 1) 100%
  );
`;

const SignInTemplate: React.FC = () => (
  <>
    <Global
      styles={css`
        html {
          height: 100%;
          font-weight: 400;
          font-family: system-ui;
          font-size: 16px;
        }
        body {
          margin: 0;
          overflow-wrap: break-word;
          height: 100%;
        }
        #app {
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }
        * {
          box-sizing: border-box;
        }
      `}
    />
    <ThemeProvider theme={theme}>
      <IntlProvider locale="ru-RU" messages={messages}>
        <Wrapper>
          <AuthForm />
        </Wrapper>
        <ToastContainer />
      </IntlProvider>
    </ThemeProvider>
  </>
);

export default SignInTemplate;
