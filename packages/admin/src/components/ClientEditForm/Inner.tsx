import React from 'react';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@via-profit/ui-kit/Button';
import Surface from '@via-profit/ui-kit/Surface';
import Typography from '@via-profit/ui-kit/Typography';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';

import querySpec, { ClientEditFormQuery } from '~/relay/artifacts/ClientEditFormQuery.graphql';
import useFormSchema, { FormSchema } from './useFormSchema';
import SectionCommon from './SectionCommon';
import Header from './Header';

interface InnerProps {
  readonly id: string;
  readonly isNew: boolean;
  readonly preloadedQuery: PreloadedQuery<ClientEditFormQuery>;
}

const Form = styled.form`
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const FormHeader = styled.header`
  background-color: #001380;
  color: #fff;
`;

const FormInner = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
`;

const FormFooter = styled.div`
  background-color: purple;
`;

const Inner: React.FC<InnerProps> = props => {
  const { preloadedQuery, id, isNew } = props;
  const { clients } = usePreloadedQuery(querySpec, preloadedQuery);
  const { schema, defaultValues } = useFormSchema({ id, client: clients.client });

  const formMethods = useForm<FormSchema>({
    defaultValues,
    resolver: yupResolver(schema, {
      stripUnknown: true,
      abortEarly: false,
    }),
  });

  const onSubmit = formMethods.handleSubmit(
    values => {
      console.debug({ values });
      toast('Success', {
        type: 'success',
      });
    },
    errors => {
      console.error({ errors, values: formMethods.getValues() });
      toast('Error', {
        type: 'error',
      });
    },
  );

  if (!isNew && !clients.client) {
    return (
      <Surface header="Client not found">
        <Typography>Ooops. Client does not found</Typography>
      </Surface>
    );
  }

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={onSubmit}>
        <FormHeader>
          <Header />
        </FormHeader>
        <FormInner>
          <SectionCommon />
        </FormInner>
        <FormFooter>
          <Button type="submit" color="default">
            Submit
          </Button>
        </FormFooter>
      </Form>
    </FormProvider>
  );
};

export default Inner;
