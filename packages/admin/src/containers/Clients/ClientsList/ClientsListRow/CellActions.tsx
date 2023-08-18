import React from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from '@emotion/styled';
import Button from '@via-profit/ui-kit/Button';

import { useContext, actionSetEditClientID } from '~/containers/Clients/ClientsList/useContext';
import EditOutline from '~/components/Icons/EditOutline';
import fragmentSpec, {
  CellActionsClientFragment$key,
} from '~/relay/artifacts/CellActionsClientFragment.graphql';

type CellActionsProps = {
  readonly clientFragmentRef: CellActionsClientFragment$key;
};

const Cell = styled.div`
  display: flex;
  flex-basis: 6em;
  justify-content: flex-end;
  align-items: center;
`;

const CellActions: React.FC<CellActionsProps> = props => {
  const { clientFragmentRef } = props;
  const { dispatch } = useContext();
  const { id } = useFragment(fragmentSpec, clientFragmentRef);

  // Click event handler
  // mark item as Editable and open the drawer
  const clickEditHandler = React.useCallback(
    () => dispatch(actionSetEditClientID(id)),
    [dispatch, id],
  );

  return React.useMemo(
    () => (
      <Cell>
        <Button iconOnly variant="plain" onClick={clickEditHandler}>
          <EditOutline />
        </Button>
      </Cell>
    ),
    [clickEditHandler],
  );
};

export default CellActions;

graphql`
  fragment CellActionsClientFragment on Client {
    id
  }
`;
