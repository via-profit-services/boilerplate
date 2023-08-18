import * as React from 'react';
import styled from '@emotion/styled';
import { graphql, useFragment } from 'react-relay';

import fragment, {
  ClientsListRowFragment$key,
} from '~/relay/artifacts/ClientsListRowFragment.graphql';
import CellCommon from './CellCommon';
import CellActions from './CellActions';

type ClientsListRowProps = {
  /**
   * Index of the record
   */
  readonly index: number;

  /**
   * Virtualized row styles
   */
  readonly style: React.CSSProperties;

  /**
   * Client fragment reference
   */
  readonly clientFragmentRef: ClientsListRowFragment$key;

  /**
   * Recalculate row height function
   */
  readonly setRowHeight: (index: number, size: number) => void;
};

const RowContainer = styled.div`
  padding: 0.2em 0.2em 0.2em 0.5em;
`;

const RowInner = styled.div`
  background-color: ${({ theme }) => theme.color.surface.toString()};
  border-radius: ${({ theme }) => theme.shape.radiusFactor}em;
  padding: 0.6em;
  display: flex;
  align-items: center;
`;

const ClientsListRow: React.FC<ClientsListRowProps> = props => {
  const { clientFragmentRef, setRowHeight, index, style } = props;
  const innerRef = React.useRef<HTMLDivElement>(null);
  const heightRef = React.useRef(0);
  const clientFragment = useFragment<ClientsListRowFragment$key>(fragment, clientFragmentRef);

  // Recalculate row height
  React.useEffect(() => {
    if (innerRef.current) {
      const height = innerRef.current.getBoundingClientRect().height;
      if (height !== heightRef.current) {
        heightRef.current = height;
        setRowHeight(index, height);
      }
    }
  }, [index, setRowHeight]);

  return (
    <div style={style}>
      <RowContainer ref={innerRef}>
        <RowInner>
          <CellCommon clientFragmentRef={clientFragment} />
          <CellActions clientFragmentRef={clientFragment} />
        </RowInner>
      </RowContainer>
    </div>
  );
};

graphql`
  fragment ClientsListRowFragment on Client {
    id
    ...CellCommonClientFragment
    ...CellActionsClientFragment
  }
`;

export default ClientsListRow;
