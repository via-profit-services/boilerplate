import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import { usersListVariablesActions } from '~/redux/slicers/usersList';
import Button from '@via-profit/ui-kit/Button';

const selector = createSelector(
  (store: ReduxStore) => store.usersListVariables.orderBy,
  orderBy => ({ orderBy }),
);

const OrderByButton: React.FC = () => {
  const { orderBy } = useSelector(selector);
  const dispatch = useDispatch();

  return (
    <>
      <Button
        type="button"
        disabled={orderBy?.[0].field === 'NAME' && orderBy?.[0].direction === 'ASC'}
        onClick={() => {
          dispatch(
            usersListVariablesActions.setPartial({
              orderBy: [
                {
                  field: 'NAME',
                  direction: 'ASC',
                },
              ],
            }),
          );
        }}
      >
        Order by name asc
      </Button>
      <Button
        type="button"
        disabled={orderBy?.[0].field === 'NAME' && orderBy?.[0].direction === 'DESC'}
        onClick={() => {
          dispatch(
            usersListVariablesActions.setPartial({
              orderBy: [
                {
                  field: 'NAME',
                  direction: 'DESC',
                },
              ],
            }),
          );
        }}
      >
        Order by name desc
      </Button>
    </>
  );
};

export default OrderByButton;
