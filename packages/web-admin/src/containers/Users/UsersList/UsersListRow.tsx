import * as React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { graphql, useFragment } from 'react-relay';

import Base from '@via-profit/ui-kit/Typography/Base';
import Button from '@via-profit/ui-kit/Button';
import fragment, { UsersListRowFragment$key } from '~/relay/artifacts/UsersListRowFragment.graphql';

type Props = {
  readonly index: number;
  readonly style: React.CSSProperties;
  readonly setRowHeight: (index: number, size: number) => void;
  readonly node: UsersListRowFragment$key;
  readonly onEditUserID: (id: string) => void;
};

const RowContainer = styled.div`
  padding: 1em 2em;
  border-bottom: 1px solid #222;
  font-size: 1.6em;
`;

const UsersListRow: React.FC<Props> = props => {
  const { node, setRowHeight, index, style, onEditUserID } = props;
  const innerRef = React.useRef<HTMLDivElement>(null);
  const heightRef = React.useRef(0);
  const { id, name } = useFragment<UsersListRowFragment$key>(fragment, node);

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
        <Base>{name}</Base>
        <Link to={`/users/edit-user/${id}`}>Edit</Link>
        <Button onClick={() => onEditUserID(id)}>Edit in drawer</Button>
      </RowContainer>
    </div>
  );
};

graphql`
  fragment UsersListRowFragment on User {
    id
    name
  }
`;

export default UsersListRow;
