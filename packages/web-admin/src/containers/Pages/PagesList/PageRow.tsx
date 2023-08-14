import React, { CSSProperties } from 'react';
import { graphql, useFragment } from 'react-relay';
import { Link, generatePath } from 'react-router-dom';
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
  background-color: ${({ theme }) => theme.color.surface.toString()};
`;

const PageRow: React.FC<PageRowProps> = props => {
  const { pageFragment, index, style, setRowHeight, sizesMap } = props;
  const { id, template, name } = useFragment(fragmentSpec, pageFragment);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const linkEditPath = React.useMemo(() => generatePath(`/pages/:id/edit-template`, { id }), [id]);
  const linkContentPath = React.useMemo(
    () => generatePath(`/pages/:id/content-blocks`, { id }),
    [id],
  );

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
        <p>
          <Link to={linkEditPath}>Edit template</Link>
        </p>
        <p>
          <Link to={linkContentPath}>Content blocks list</Link>
        </p>
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
