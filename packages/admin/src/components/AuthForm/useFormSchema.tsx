import * as React from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';

export interface FormSchema {
  readonly login: string;
  readonly password: string;
  readonly showPassword: boolean;
}

const useFormSchema = () => {
  const intl = useIntl();
  const schema: Yup.ObjectSchema<FormSchema> = React.useMemo(
    () =>
      Yup.object({
        login: Yup.string()
          .required(
            intl.formatMessage({
              defaultMessage: 'Введите имя пользователя',
            }),
          )
          .defined(),
        password: Yup.string()
          .required(
            intl.formatMessage({
              defaultMessage: 'Введите пароль',
            }),
          )
          .defined(),
        showPassword: Yup.boolean().defined(),
      }),
    [intl],
  );

  const defaultValues: FormSchema = {
    login: '',
    password: '',
    showPassword: false,
  };

  return {
    schema,
    defaultValues,
  };
};

export default useFormSchema;
