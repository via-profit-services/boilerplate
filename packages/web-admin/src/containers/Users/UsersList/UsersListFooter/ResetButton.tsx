import * as React from 'react';
import { useDispatch } from 'react-redux';

import { usersListVariablesActions } from '~/redux/slicers/usersList';
import Button from '~/components/Button';

const ResetButton: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <Button
      type="button"
      onClick={() => {
        dispatch(usersListVariablesActions.reset());
      }}
    >
      Reset
    </Button>
  );
};

export default ResetButton;
