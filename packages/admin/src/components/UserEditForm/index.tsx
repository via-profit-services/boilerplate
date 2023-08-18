import * as React from 'react';
import { graphql, useLazyLoadQuery, useMutation } from 'react-relay';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import query, { UserEditFormQuery } from '~/relay/artifacts/UserEditFormQuery.graphql';
import updateMutationSpec, {
  UserEditFormUpdateMutation,
  UserEditFormUpdateMutation$data,
} from '~/relay/artifacts/UserEditFormUpdateMutation.graphql';
import useFormSchema, { FormSchema } from './useFormSchema';
import UserEditFormComponent from './UserEditFormComponent';

graphql`
  query UserEditFormQuery($id: ID!) {
    users {
      user(id: $id) {
        ...UserEditFormFragment @relay(mask: false)
      }
    }
  }
`;

graphql`
  fragment UserEditFormFragment on User {
    id
    name
    account {
      id
      login
      status
      roles
    }
  }
`;

graphql`
  mutation UserEditFormUpdateMutation($id: ID!, $input: UserUpdateInput!) {
    users {
      update(id: $id, input: $input) {
        __typename
        ... on UserUpdateError {
          name
          msg
        }
        ... on UserUpdateSuccess {
          user {
            ...UserEditFormFragment @relay(mask: false)
          }
        }
      }
    }
  }
`;

export interface UserEditFormProps {
  readonly id: string;
  readonly onError?: (err: Error) => void;
  readonly onCompleted?: (response: UserEditFormUpdateMutation$data) => void;
}

const UserEditForm: React.FC<UserEditFormProps> = props => {
  const { id, onError, onCompleted } = props;
  const { users } = useLazyLoadQuery<UserEditFormQuery>(query, { id });
  const isNew = users.user === null;
  const { schema, defaultValues } = useFormSchema({ id, user: users.user });
  const [updateMutation] = useMutation<UserEditFormUpdateMutation>(updateMutationSpec);
  const formMethods = useForm<FormSchema>({
    defaultValues,
    resolver: yupResolver(schema, {
      stripUnknown: true,
      abortEarly: false,
    }),
  });

  const { handleSubmit, getValues } = formMethods;
  const onSubmit = handleSubmit(
    values => {
      // if is update
      if (!isNew) {
        updateMutation({
          variables: {
            id,
            input: {
              name: values.name,
            },
          },
          onError,
          onCompleted: response => {
            if (response.users.update.__typename === 'UserUpdateError') {
              console.error('Fucked', response.users.update.name);

              return;
            }

            if (response.users.update.__typename === 'UserUpdateSuccess') {
              if (typeof onCompleted === 'function') {
                console.debug('Success');
                onCompleted(response);
              }
            }
          },
          updater: store => {
            store.get('client:root:users')?.invalidateRecord();
          },
        });
      }
    },
    errors => {
      console.debug({
        errors,
        values: getValues(),
      });
    },
  );

  return <UserEditFormComponent formMethods={formMethods} onSubmit={onSubmit} />;
};

export default UserEditForm;
