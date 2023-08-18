import * as React from 'react';
import styled from '@emotion/styled';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LocaleProvider from '~/providers/LocaleProvider';
import ThemeProvider from '~/providers/ThemeProvider';
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
    <ThemeProvider>
      <LocaleProvider>
        <Wrapper>
          <AuthForm />
        </Wrapper>
      </LocaleProvider>
    </ThemeProvider>
  </>
);

export default SignInTemplate;
