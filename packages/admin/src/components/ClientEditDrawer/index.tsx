import * as React from 'react';
import styled from '@emotion/styled';
import ModalDrawer, { ModalDrawerProps } from '@via-profit/ui-kit/Modal/ModalDrawer';

import ClientEditForm, { ClientEditFormProps } from '~/components/ClientEditForm';
import LoadingIndicator from '~/components/LoadingIndicator';

export interface ClientEditDrawerProps
  extends Omit<ModalDrawerProps, 'id' | 'isOpen' | 'children'>,
    Omit<ClientEditFormProps, 'id'> {
  readonly id: string | null;
}

const Container = styled.div`
  height: 80vh;
  background-color: ${({ theme }) => theme.color.backgroundPrimary.toString()};
  flex: 1;
`;

const ClientEditDrawer: React.FC<ClientEditDrawerProps> = props => {
  const { id, ...modalProps } = props;

  return (
    <ModalDrawer {...modalProps} isOpen={id !== null}>
      <React.Suspense fallback={<LoadingIndicator />}>
        <Container>{id !== null && <ClientEditForm id={id} isNew={false} />}</Container>
      </React.Suspense>
    </ModalDrawer>
  );
};

export default ClientEditDrawer;
