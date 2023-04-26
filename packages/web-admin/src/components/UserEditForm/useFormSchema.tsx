import * as React from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';

import {
  UserEditFormQuery$data,
  AccountRole,
  AccountStatus,
} from '~/relay/artifacts/UserEditFormQuery.graphql';

export interface FormSchema {
  readonly id: string;
  readonly name: string;
  readonly account: {
    readonly id: string;
    readonly login: string;
    readonly password: string;
    readonly status: AccountStatus;
    readonly roles: AccountRole[];
  } | null;
}

interface Props {
  readonly id: string;
  readonly user: UserEditFormQuery$data['users']['user'];
}

const useFormSchema = (props: Props) => {
  const { id, user } = props;
  const intl = useIntl();

  const schema: Yup.ObjectSchema<FormSchema> = React.useMemo(
    () =>
      Yup.object({
        id: Yup.string().required().defined(),
        name: Yup.string().required().defined(),
        account: Yup.object({
          id: Yup.string().defined(),
          status: Yup.string().oneOf<AccountStatus>(['ALLOWED', 'FORBIDDEN']).defined(),
          roles: Yup.array(
            Yup.string()
              .defined()
              .nonNullable()
              .oneOf<AccountRole>([
                'DEVELOPER',
                'ADMINISTRATOR',
                'VIEWER',
                'OPTIMIZATOR',
                'COPYWRITER',
              ]),
          )
            .required()
            .defined(),
          login: Yup.string()
            .required(
              intl.formatMessage({
                defaultMessage: 'Введите имя пользователя',
              }),
            )
            .defined(),
          password: Yup.string().required().defined(),
        })
          .nullable()
          .defined(),
      }),
    [intl],
  );

  const defaultValues: FormSchema = {
    id,
    name: '',
    ...user,
    account: user?.account
      ? {
          ...user.account,
          roles: [...user.account.roles],
          password: '', // the password must be always an empty
        }
      : null,
  };

  return {
    schema,
    defaultValues,
  };
};

export default useFormSchema;
