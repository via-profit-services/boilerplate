import React from 'react';
import Button from '@via-profit/ui-kit/Button';
import { FormattedMessage } from 'react-intl';

import { useContext, actionResetVariables } from '../useContext';

const Footer: React.FC = () => {
  const { dispatch } = useContext();

  return React.useMemo(
    () => (
      <Button color="primary" variant="outlined" onClick={() => dispatch(actionResetVariables())}>
        <FormattedMessage defaultMessage="Сбросить" />
      </Button>
    ),
    [dispatch],
  );
};

export default Footer;
