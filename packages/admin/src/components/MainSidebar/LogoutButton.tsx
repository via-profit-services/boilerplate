import * as React from 'react';
import styled from '@emotion/styled';
import LogOutIcon from 'mdi-react/ExitToAppIcon';
import { graphql, useMutation } from 'react-relay';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import { authActions } from '~/redux/slicers/auth';
import mutationNode, { LogoutButtonMutation } from '~/relay/artifacts/LogoutButtonMutation.graphql';

const Button = styled.button`
  outline: none;
  border: 0;
  background-color: #382c93;
  color: #fff;
  padding: 0.5em;
  border-radius: 100%;
  font-size: 1em;
  cursor: pointer;
  width: auto;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = React.HtmlHTMLAttributes<HTMLButtonElement>;

const selector = createSelector(
  (store: ReduxStore) => store.auth.accessToken?.payload?.id || null,
  accessTokenID => ({ accessTokenID }),
);

const LogOutButton: React.ForwardRefRenderFunction<HTMLButtonElement, Props> = (props, ref) => {
  const dispatch = useDispatch();
  const { accessTokenID } = useSelector(selector);
  const [revokeTokenMutation] = useMutation<LogoutButtonMutation>(mutationNode);

  const handleLogout: React.ReactEventHandler<HTMLButtonElement> = () => {
    revokeTokenMutation({
      variables: {
        tokenID: accessTokenID || '',
      },
      optimisticUpdater: proxyStore => {
        proxyStore.invalidateStore();
        dispatch(authActions.reset());
      },
    });
  };

  return (
    <Button {...props} ref={ref} onClick={handleLogout}>
      <LogOutIcon size="1em" />
    </Button>
  );
};

graphql`
  mutation LogoutButtonMutation($tokenID: ID!) {
    authentification {
      revoke(tokenID: $tokenID)
    }
  }
`;

export default React.forwardRef(LogOutButton);
