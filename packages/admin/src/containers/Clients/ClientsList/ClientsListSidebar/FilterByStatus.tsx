import React from 'react';
import Button from '@via-profit/ui-kit/Button';
import { FormattedMessage } from 'react-intl';

import useClient from '~/containers/Clients/utils/useClient';
import Label from '~/components/Label';
import useContext, { actionSetVariables, State } from '../useContext';

type Status = NonNullable<State['variables']['status']>[0];

const FilterByStatus: React.FC = () => {
  const { state } = useContext();
  const selectedStatus = state.variables.status || null;
  const { resolveClientStatus } = useClient();
  const { dispatch } = useContext();
  const variants: readonly Status[] = React.useMemo(() => ['ACTIVE', 'INACTIVE'], []);

  return React.useMemo(
    () => (
      <>
        <Label>
          <FormattedMessage defaultMessage="Статус клиента" />
        </Label>
        <div>
          {variants.map(legalStatus => {
            const { label } = resolveClientStatus(legalStatus);
            const selected = selectedStatus && selectedStatus.includes(legalStatus);

            return (
              <Button
                key={legalStatus}
                color={selected ? 'primary' : 'default'}
                onClick={() => {
                  const list = new Set(selectedStatus);

                  if (selected) {
                    list.delete(legalStatus);
                  } else {
                    list.add(legalStatus);
                  }

                  dispatch(
                    actionSetVariables({
                      status: list.size === 0 ? null : [...list],
                    }),
                  );
                }}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </>
    ),
    [dispatch, resolveClientStatus, selectedStatus, variants],
  );
};

export default FilterByStatus;
