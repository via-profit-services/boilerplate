import * as React from 'react';
import { useParams } from 'react-router-dom';

import ContentArea from '~/components/ContentArea';
import ClientEditForm from '~/components/ClientEditForm';

type PathParams = {
  readonly id: string;
};

const ClientEdit: React.FC = () => {
  const { id } = useParams<PathParams>();

  return <ContentArea>{id && <ClientEditForm isNew={false} id={id} />}</ContentArea>;
};

export default ClientEdit;
