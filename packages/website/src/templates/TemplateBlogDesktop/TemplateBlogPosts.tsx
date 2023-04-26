import React from 'react';
import { graphql, useFragment, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

import fragmentSpec, {
  TemplateBlogPostsFragment$key,
} from '~/relay/artifacts/TemplateBlogPostsFragment.graphql';
import paginatiosSpec, {
  TemplateBlogPostsPaginationFragment$key,
} from '~/relay/artifacts/TemplateBlogPostsPaginationFragment.graphql';
import querySpec, { PageQuery } from '~/relay/artifacts/PageQuery.graphql';

interface TemplateBlogPostsProps {
  readonly fragmentRef: TemplateBlogPostsFragment$key | null;
}

const List = styled.ul`
  text-align: left;
`;

const TemplateBlogPosts: React.FC<TemplateBlogPostsProps> = props => {
  const { fragmentRef } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);
  const pagerFragment = useLazyLoadQuery<PageQuery>(querySpec, {
    isDesktop: true,
    isBlog: true,
    path: fragment?.page.path || '',
    firstPost: 10,
    afterPost: null,
  });

  // return <>{fragment?.page.path}</>;
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    PageQuery,
    TemplateBlogPostsPaginationFragment$key
  >(paginatiosSpec, pagerFragment);

  return (
    <>
      <button type="button" onClick={() => loadNext(60)} disabled={!hasNext || isLoadingNext}>
        Load more 60
      </button>
      <List>
        {data.pages.resolve.template?.posts?.edges.map(({ node }) => (
          <li key={node.id}>
            <Link to={node.page?.path || ''}>
              {node.page?.template?.image?.file?.preview?.url && (
                <img width="40" height="40" src={node.page.template.image.file.preview.url} />
              )}
              {node.page?.name}
            </Link>
          </li>
        ))}
      </List>
      <button type="button" onClick={() => loadNext(60)} disabled={!hasNext || isLoadingNext}>
        Load more 60
      </button>
    </>
  );
};

export default TemplateBlogPosts;

graphql`
  fragment TemplateBlogPostsFragment on TemplateBlogPage {
    page {
      ...TemplateBlogPostsPageFragment @relay(mask: false)
    }
  }
`;

graphql`
  fragment TemplateBlogPostsPaginationFragment on Query
  @refetchable(queryName: "TemplateBlogPostsPaginationQuery") {
    pages {
      resolve(path: $path) {
        template {
          ... on TemplateBlogPage {
            posts(
              first: $firstPost
              after: $afterPost
              orderBy: [{ field: PUBLISHED_AT, direction: ASC }]
            ) @connection(key: "TemplateBlogPostsPagination_posts") {
              edges {
                node {
                  id
                  publishedAt
                  page {
                    ...TemplateBlogPostsPageFragment @relay(mask: false)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

graphql`
  fragment TemplateBlogPostsPageFragment on Page {
    id
    path
    name
    template {
      ... on TemplateBlogPostPage {
        image {
          file {
            preview: transform(
              input: [{ cover: { w: 100, h: 100 } }, { format: { type: WEBP, quality: 25 } }]
            ) {
              url
            }
          }
        }
      }
    }
  }
`;
