import React from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from '@emotion/styled';

import ClientLegalStatusBadge from '~/components/ClientLegalStatusBadge';
import ClientStatusBadge from '~/components/ClientStatusBadge';
import fragmentSpec, {
  CellCommonClientFragment$key,
} from '~/relay/artifacts/CellCommonClientFragment.graphql';

type CellCommonProps = {
  readonly clientFragmentRef: CellCommonClientFragment$key;
};

const Name = styled.div`
  font-weight: 500;
`;

const Cell = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const CellCommon: React.FC<CellCommonProps> = props => {
  const { clientFragmentRef } = props;
  const { name, legalStatus, status } = useFragment(fragmentSpec, clientFragmentRef);

  return (
    <Cell>
      <ClientStatusBadge status={status} />
      <ClientLegalStatusBadge legalStatus={legalStatus} />
      <Name>{name}</Name>
    </Cell>
  );
};

export default CellCommon;

graphql`
  fragment CellCommonClientFragment on Client {
    id
    name
    status
    legalStatus
  }
`;
