import React from 'react';

import { useContext, actionSetEditClientID } from '../useContext';
import ClientEditDrawer from '~/components/ClientEditDrawer';

const ClientEditForm: React.FC = () => {
  const { state, dispatch } = useContext();
  const { editClientID } = state;
  const editClientIDRef = React.useRef(editClientID);

  React.useEffect(() => {
    if (editClientID !== editClientIDRef.current) {
      editClientIDRef.current = editClientID;

      if (editClientID) {
        dispatch(actionSetEditClientID(editClientID));
      } else {
        dispatch(actionSetEditClientID(null));
      }
    }
  }, [dispatch, editClientID]);

  return React.useMemo(
    () => (
      <ClientEditDrawer
        id={editClientID}
        isNew={false}
        onRequestClose={() => dispatch(actionSetEditClientID(null))}
      />
    ),
    [editClientID, dispatch],
  );
};

export default ClientEditForm;
