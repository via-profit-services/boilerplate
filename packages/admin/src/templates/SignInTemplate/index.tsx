import * as React from 'react';
import styled from '@emotion/styled';

import BaseTemplate from '~/templates/BaseTemplate';
import AuthForm from '~/components/AuthForm';

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.color.surface.darken(10).toString()};
`

/**
 * Sign in template.
 */
const SignInTemplate: React.FC = () => (
  <BaseTemplate>
  <FormContainer>
    <AuthForm />
    </FormContainer>
  </BaseTemplate>
);

export default SignInTemplate;
