import * as React from 'react';
import styled from '@emotion/styled';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormattedMessage, useIntl } from 'react-intl';
import { graphql, useMutation } from 'react-relay';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import TextField from '@via-profit/ui-kit/TextField';
import Paragraph from '@via-profit/ui-kit/Typography/Paragraph';
import Button from '@via-profit/ui-kit/Button';
import Logo from '~/components/Logo';
import useFormSchema, { FormSchema } from '~/components/AuthForm/useFormSchema';
import mutation, {
  FormCreateTokenMutation,
} from '~/relay/artifacts/FormCreateTokenMutation.graphql';
import { authActions } from '~/redux/slicers/auth';

export type FormProps = React.FormHTMLAttributes<HTMLFormElement>;

const Form = styled.form`
  display: flex;
  flex-flow: column;
`;

const FormContent = styled.div`
  flex: 1;
  padding: 8em 1em;
`;

const StyledField = styled(TextField)`
  margin-bottom: 0.8em;
`;

const StyledLogo = styled(Logo)`
  font-size: 2em;
  margin: 0 auto 1em auto;
  display: block;
  color: ${({ theme }) => theme.color.textPrimary.toString()};
`;

const SubmitButton = styled(Button)`
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 1em;
`;

const FormFooter = styled.div`
  padding: 1em;
  text-align: center;
  color: ${({ theme }) => theme.color.textSecondary.toString()};
`;

const AuthFormWithRef: React.ForwardRefRenderFunction<HTMLFormElement, FormProps> = (
  props,
  ref,
) => {
  const passwordInputRef = React.useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const intl = useIntl();
  const [createToken, inProgress] = useMutation<FormCreateTokenMutation>(mutation);
  const { schema, defaultValues } = useFormSchema();
  const { handleSubmit, control, setValue } = useForm<FormSchema>({
    defaultValues,
    resolver: yupResolver(schema, {
      stripUnknown: true,
      abortEarly: false,
    }),
  });

  const intlMessages = React.useMemo(
    () => ({
      InvalidCredentials: intl.formatMessage({
        defaultMessage: 'Неверный логин или пароль',
      }),
      unknownError: intl.formatMessage({
        defaultMessage: 'Неизвестная ошибка',
      }),
      success: intl.formatMessage({
        defaultMessage: 'Авторизация пройдена успешно',
      }),
    }),
    [intl],
  );

  const onSubmit = handleSubmit(variables => {
    createToken({
      variables,
      onCompleted: response => {
        const { authentification } = response;
        const { __typename } = authentification.create;

        // If is invalid credentials error or any
        if (__typename === 'TokenRegistrationError') {
          // Reset password required
          setValue('password', '');
          passwordInputRef.current?.focus();
          toast(intlMessages[authentification.create.name] || intlMessages.unknownError, {
            type: 'error',
            position: 'bottom-center',
          });
        }

        // Successfully created
        if (__typename === 'TokenRegistrationSuccess') {
          dispatch(
            authActions.auth({
              accessToken: authentification.create.payload.accessToken,
              refreshToken: authentification.create.payload.refreshToken,
            }),
          );
        }
      },
      onError: () => {
        // Unknown error
        toast(intlMessages.unknownError, {
          type: 'error',
          position: 'bottom-center',
        });
      },
    });
  });

  return (
    <Form onSubmit={onSubmit} {...props} ref={ref}>
      <FormContent>
        <StyledLogo variant="inline" />
        <Controller
          control={control}
          name="login"
          render={({ field, fieldState }) => (
            <StyledField
              {...field}
              fullWidth
              autoComplete="username"
              readOnly={inProgress}
              error={!!fieldState.error}
              errorText={fieldState.error?.message}
              aria-label={intl.formatMessage({ defaultMessage: 'Поле ввода логина' })}
              label={intl.formatMessage({ defaultMessage: 'Имя пользователя' })}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <StyledField
              {...field}
              type="password"
              fullWidth
              autoComplete="current-password"
              readOnly={inProgress}
              inputRef={passwordInputRef}
              error={!!fieldState.error}
              errorText={fieldState.error?.message}
              aria-label={intl.formatMessage({ defaultMessage: 'Поле ввода пароля' })}
              label={intl.formatMessage({ defaultMessage: 'Пароль' })}
            />
          )}
        />
        <SubmitButton
          overrides={{
            TextWrapper: React.forwardRef(function TextWrapper(props, ref) {
              const { children, ...restProps } = props;
              return (
                <span {...restProps} ref={ref}>
                  {children}
                </span>
              );
            }),
          }}
          color="primary"
          variant="standard"
          disabled={inProgress}
          type="submit"
          aria-label={intl.formatMessage({
            defaultMessage: 'Отправить форму и для проверки авторизации',
          })}
        >
          <FormattedMessage defaultMessage="Войти" />
        </SubmitButton>
      </FormContent>
      <FormFooter>Lorem ipsum dolor</FormFooter>
    </Form>
  );
};

const AuthForm = React.forwardRef(AuthFormWithRef);

export default AuthForm;

graphql`
  mutation FormCreateTokenMutation($login: String!, $password: String!) {
    authentification {
      create(login: $login, password: $password) {
        __typename
        ... on TokenRegistrationSuccess {
          payload {
            accessToken {
              token
              payload {
                id
                uuid
                exp
                iss
                roles
                type
              }
            }
            refreshToken {
              token
              payload {
                id
                uuid
                exp
                iss
                type
              }
            }
          }
        }
        ... on TokenRegistrationError {
          name
          msg
        }
      }
    }
  }
`;
