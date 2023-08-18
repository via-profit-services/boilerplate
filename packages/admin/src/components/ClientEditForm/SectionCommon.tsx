import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Surface from '@via-profit/ui-kit/Surface';
import TextField from '@via-profit/ui-kit/TextField';

import type { FormSchema } from './useFormSchema';

const SectionCommon: React.FC = () => {
  const { control, register } = useFormContext<FormSchema>();

  register('id');

  return (
    <Surface>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField
            label="name"
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            error={Boolean(fieldState.error)}
            errorText={fieldState.error?.message}
          />
        )}
      />
    </Surface>
  );
};

export default SectionCommon;
