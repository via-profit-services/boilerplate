import React from 'react';
import { useIntl } from 'react-intl';
import Color from '@via-profit/ui-kit/Color';

export type ClientLegalStatus =
  | 'ENTREPRENEUR'
  | 'LEGAL'
  | 'PERSON'
  | 'SELFEMPLOYED'
  | '%future added value';

export type ClientStatus = 'ACTIVE' | 'INACTIVE' | '%future added value';

export type ResolvePayload = {
  readonly label: string;
  readonly color: Color;
};

export type ResolveClientLegalStatus = (legalStatus: ClientLegalStatus) => ResolvePayload;
export type ResolveClientStatus = (status: ClientStatus) => ResolvePayload;

const useClient = () => {
  const intl = useIntl();

  const resolveClientStatus: ResolveClientStatus = React.useCallback(
    status => {
      switch (status) {
        case 'ACTIVE':
        default:
          return {
            color: new Color('#00ff00'),
            label: intl.formatMessage({ defaultMessage: 'Действующий' }),
          };
        case 'INACTIVE':
          return {
            color: new Color('#ff0000'),
            label: intl.formatMessage({ defaultMessage: 'Не действующий' }),
          };
      }
    },
    [intl],
  );

  /**
   * Returns translated client legal status and color of the legal status
   */
  const resolveClientLegalStatus: ResolveClientLegalStatus = React.useCallback(
    legalStatus => {
      switch (legalStatus) {
        case 'PERSON':
        default:
          return {
            color: new Color('#00ff00'),
            label: intl.formatMessage({ defaultMessage: 'Физ. лицо' }),
          };

        case 'SELFEMPLOYED':
          return {
            color: new Color('#ffa500'),
            label: intl.formatMessage({ defaultMessage: 'Самозанятый' }),
          };

        case 'ENTREPRENEUR':
          return {
            color: new Color('#ff0000'),
            label: intl.formatMessage({ defaultMessage: 'ИП' }),
          };

        case 'LEGAL':
          return {
            color: new Color('#4371e5'),
            label: intl.formatMessage({ defaultMessage: 'Юр. лицо' }),
          };
      }
    },
    [intl],
  );

  return {
    resolveClientLegalStatus,
    resolveClientStatus,
  };
};

export default useClient;
