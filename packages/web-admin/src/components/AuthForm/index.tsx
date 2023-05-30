import * as React from 'react';
import styled from '@emotion/styled';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormattedMessage, useIntl } from 'react-intl';
import { graphql, useMutation } from 'react-relay';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import TextField from '@boilerplate/ui-kit/src/TextField';
import Paragraph from '@boilerplate/ui-kit/src/Typography/Paragraph';
import Button from '@boilerplate/ui-kit/src/Button';
import Logo from '~/components/Logo';
import useFormSchema, { FormSchema } from '~/components/AuthForm/useFormSchema';
import mutation, {
  AuthFormCreateTokenMutation,
} from '~/relay/artifacts/AuthFormCreateTokenMutation.graphql';
import { authActions } from '~/redux/slicers/auth';

export interface AuthFormProps {
  onSuccess: (values: FormSchema) => void;
}

const Form = styled.form`
  display: flex;
  flex-flow: column;
  background: linear-gradient(0deg, #f1f1f1 30%, #fff 50%, #fff);
  border-radius: 0.4em;
  box-shadow: 0 7px 12px #00000026;
  min-width: 300px;
`;

const FormHeader = styled.div`
  font-size: 1.4em;
  padding: 2em 1em;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  color: #fff;
  display: flex;
  justify-content: center;
  background: linear-gradient(0deg, #252525 30%, #252525 50%, #252525);
`;

const FormContent = styled.div`
  flex: 1;
  padding: 0 1em 2em 1em;
`;

const FormFooter = styled.div`
  padding: 1em;
  border-top: 1px solid #d3d2d2;
`;

const StyledField = styled(TextField)`
  margin-bottom: 0.8em;
`;

const StyledLogo = styled(Logo)`
  height: 1.8em;
`;

const Title = styled(Paragraph)``;

const AuthForm: React.FC = () => {
  const passwordInputRef = React.useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const intl = useIntl();
  const [createToken, inProgress] = useMutation<AuthFormCreateTokenMutation>(mutation);
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
    <Form onSubmit={onSubmit}>
      <FormHeader>
        <StyledLogo variant="inline" />
      </FormHeader>
      <FormContent>
        <Title>
          <FormattedMessage defaultMessage="Авторизация" />
        </Title>
        <Controller
          control={control}
          name="login"
          render={({ field, fieldState }) => (
            <StyledField
              {...field}
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
      </FormContent>
      <FormFooter>
        <Button
          variant="contained"
          color="default"
          disabled={inProgress}
          type="submit"
          aria-label={intl.formatMessage({
            defaultMessage: 'Отправить форму и для проверки авторизации',
          })}
        >
          <FormattedMessage defaultMessage="Войти" />
        </Button>
      </FormFooter>
    </Form>
  );
};

export default AuthForm;

graphql`
  mutation AuthFormCreateTokenMutation($login: String!, $password: String!) {
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
