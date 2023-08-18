import React from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';

import { ClientEditFormQuery$data } from '~/relay/artifacts/ClientEditFormQuery.graphql';

export interface FormSchema {
  readonly id: string;
  readonly name: string;
}

interface Props {
  readonly id: string;
  readonly client: ClientEditFormQuery$data['clients']['client'];
}

export const useFormSchema = (props: Props) => {
  const { id, client } = props;
  const intl = useIntl();

  const defaultValues: FormSchema = React.useMemo(
    () => ({
      id,
      name: '',
      ...client,
    }),
    [id, client],
  );

  const schema: Yup.ObjectSchema<FormSchema> = React.useMemo(
    () =>
      Yup.object({
        id: Yup.string().required().defined(),
        name: Yup.string()
          .required(
            intl.formatMessage({
              defaultMessage: 'Укажите имя клиента',
            }),
          )
          .defined(),
      }),
    [intl],
  );

  return { schema, defaultValues };
};

export default useFormSchema;
