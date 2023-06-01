import React from 'react';
import { graphql, useFragment, usePaginationFragment } from 'react-relay';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '@boilerplate/ui-kit/src/Button';

import { PageQuery } from '~/relay/artifacts/PageQuery.graphql';
import fragmentSpec, {
  TemplateBlogPostsFragment$key,
} from '~/relay/artifacts/TemplateBlogPostsFragment.graphql';
import pagesFragmentSpec, {
  TemplateBlogPostsListFragment$key,
} from '~/relay/artifacts/TemplateBlogPostsListFragment.graphql';

interface TemplateBlogPostsProps {
  readonly fragmentRef: TemplateBlogPostsFragment$key | null;
}

const List = styled.ul`
  text-align: left;
`;

type DisplayPostListProps = {
  readonly fragmentRef: TemplateBlogPostsListFragment$key;
};

const DisplayPostList: React.FC<DisplayPostListProps> = (props: DisplayPostListProps) => {
  const { fragmentRef } = props;
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    PageQuery,
    TemplateBlogPostsListFragment$key
  >(pagesFragmentSpec, fragmentRef);

  const edges = data?.template?.posts?.edges || [];

  return (
    <>
      <Button type="button" onClick={() => loadNext(5)} disabled={!hasNext || isLoadingNext}>
        Load more 5
      </Button>
      <List>
        {edges.map(({ node }) => (
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
      <Button type="button" onClick={() => loadNext(5)} disabled={!hasNext || isLoadingNext}>
        Load more 5
      </Button>
    </>
  );
};

const TemplateBlogPosts: React.FC<TemplateBlogPostsProps> = props => {
  const { fragmentRef } = props;

  const fragment = useFragment(fragmentSpec, fragmentRef);

  return (
    <>
      List:
      {fragment?.page && <DisplayPostList fragmentRef={fragment.page} />}
    </>
  );
};

export default TemplateBlogPosts;

graphql`
  fragment TemplateBlogPostsFragment on TemplateBlogPage {
    page {
      ...TemplateBlogPostsListFragment
    }
  }
`;

graphql`
  fragment TemplateBlogPostsListFragment on Page
  @argumentDefinitions(
    firstPost: { type: "Int", defaultValue: 3 }
    afterPost: { type: "String", defaultValue: null }
  )
  @refetchable(queryName: "TemplateBlogPostsPaginationQuery") {
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
