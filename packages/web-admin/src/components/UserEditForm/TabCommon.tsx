import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { FormSchema } from './useFormSchema';
import TextField from '~/components/TextField';
import Card from '~/components/Card';

const TabCommon: React.FC = () => {
  const { control } = useFormContext<FormSchema>();

  return (
    <Card header="User common tab">
      <Controller
        control={control}
        name="id"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            readOnly
            error={Boolean(fieldState.error)}
            errorText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            error={Boolean(fieldState.error)}
            errorText={fieldState.error?.message}
          />
        )}
      />
    </Card>
  );
};

export default TabCommon;
