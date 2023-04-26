import * as React from 'react';
import { useParams } from 'react-router-dom';

import UserEditForm from '~/components/UserEditForm';
import ContentArea from '~/components/ContentArea';

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <ContentArea>
      <UserEditForm id={id || ''} onCompleted={() => console.debug('OK')} />
    </ContentArea>
  );
};

export default UserEdit;
