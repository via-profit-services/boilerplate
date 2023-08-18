import React from 'react';
import Button from '@via-profit/ui-kit/Button';
import { FormattedMessage } from 'react-intl';

import useClient from '~/containers/Clients/utils/useClient';
import Label from '~/components/Label';
import useContext, { actionSetVariables, State } from '../useContext';

type LegalStatus = NonNullable<State['variables']['legalStatus']>[0];

const FilterByLegalStatus: React.FC = () => {
  const { resolveClientLegalStatus } = useClient();
  const { state, dispatch } = useContext();
  const selectedLegalStatus = state.variables.legalStatus;
  const variants: readonly LegalStatus[] = React.useMemo(
    () => ['PERSON', 'ENTREPRENEUR', 'LEGAL', 'SELFEMPLOYED'],
    [],
  );

  return React.useMemo(
    () => (
      <>
        <Label>
          <FormattedMessage defaultMessage="Юр. статус клиента" />
        </Label>
        <div>
          {variants.map(legalStatus => {
            const { label } = resolveClientLegalStatus(legalStatus);
            const selected = selectedLegalStatus && selectedLegalStatus.includes(legalStatus);

            return (
              <Button
                key={legalStatus}
                color={selected ? 'primary' : 'default'}
                onClick={() => {
                  const list = new Set(selectedLegalStatus);

                  if (selected) {
                    list.delete(legalStatus);
                  } else {
                    list.add(legalStatus);
                  }

                  dispatch(
                    actionSetVariables({
                      legalStatus: list.size === 0 ? null : [...list],
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
    [dispatch, resolveClientLegalStatus, selectedLegalStatus, variants],
  );
};

export default FilterByLegalStatus;
