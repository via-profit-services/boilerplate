import React, { CSSProperties } from 'react';
import { graphql, useFragment } from 'react-relay';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

import fragmentSpec, { PageRowFragment$key } from '~/relay/artifacts/PageRowFragment.graphql';

export interface PageRowProps {
  readonly pageFragment: PageRowFragment$key;
  readonly style: CSSProperties;
  readonly index: number;
  readonly sizesMap: Map<number, number>;
  readonly setRowHeight: (index: number, height: number) => void;
}

const PageContainer = styled.div`
  padding: 1em 1.2em;
  border-bottom: 1px solid #d3d2d2;
  background-color: ${({ theme }) => theme.colors.background.area};
`;

const PageRow: React.FC<PageRowProps> = props => {
  const { pageFragment, index, style, setRowHeight, sizesMap } = props;
  const { id, template, name } = useFragment(fragmentSpec, pageFragment);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const linkPath = React.useMemo(() => `/pages/edit/${id}`, [id]);

  React.useEffect(() => {
    if (containerRef.current && !sizesMap.has(index)) {
      setRowHeight(index, containerRef.current.getBoundingClientRect().height);
    }
  }, [index, setRowHeight, sizesMap]);

  return (
    <div style={style}>
      <PageContainer ref={containerRef}>
        <p>
          Page <b>{name}</b>
        </p>
        <p>Template {template?.__typename}</p>
        <Link to={linkPath}>Edit</Link>
      </PageContainer>
    </div>
  );
};

export default PageRow;

graphql`
  fragment PageRowFragment on Page {
    id
    name
    template {
      __typename
    }
  }
`;
