import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import type { FormSchema } from './useFormSchema';

const Header: React.FC = () => {
  const { control } = useFormContext<FormSchema>();
  const name = useWatch({ control, name: 'name' });

  return <>Client «{name}»</>;
};

export default Header;
