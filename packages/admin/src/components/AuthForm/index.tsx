import * as React from 'react';
import styled from '@emotion/styled';

import Form from './Form';
import WelcomeBlock from './WelcomeBlock';

export type AuthFormProps = React.HTMLAttributes<HTMLDivElement>;

const FormContainer = styled.div`
  border-radius: ${({ theme }) => theme.shape.radiusFactor}em;
  background-color: ${({ theme }) => theme.color.surface.toString()};
  box-shadow: ${({ theme }) =>
    `0 0.8em 4em -1em ${theme.color.surface.darken(80).alpha(0.6).toString()}`};
  display: flex;
`;

const StyledForm = styled(Form)`
  width: 18em;
  padding: 0 3em;
  border-top-left-radius: ${({ theme }) => theme.shape.radiusFactor}em;
  border-bottom-left-radius: ${({ theme }) => theme.shape.radiusFactor}em;
`;

const AuthFormWithRef: React.ForwardRefRenderFunction<HTMLDivElement, AuthFormProps> = (
  props,
  ref,
) => (
  <FormContainer {...props} ref={ref}>
    <StyledForm />
    <WelcomeBlock />
  </FormContainer>
);

const AuthForm = React.forwardRef(AuthFormWithRef);

export default AuthForm;
