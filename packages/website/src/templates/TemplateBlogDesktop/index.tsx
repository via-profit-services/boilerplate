import React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
// import { Helmet } from 'react-helmet-async';

import Header from '~/components/Header';
import TemplateBlogHeading from './TemplateBlogHeading';
import TemplateBlogPosts from './TemplateBlogPosts';
import fragment, {
  TemplateBlogDesktopFragment$key,
} from '~/relay/artifacts/TemplateBlogDesktopFragment.graphql';

interface Props {
  readonly fragmentRef: TemplateBlogDesktopFragment$key;
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 20px;
  flex: 1;
  text-align: center;
`;

const TemplateBlogDesktopFragment: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { template } = useFragment<TemplateBlogDesktopFragment$key>(fragment, fragmentRef);

  if (template?.__typename !== 'TemplateBlogPage') {
    return null;
  }

  return (
    <>
      {/* <Helmet htmlAttributes={{ lang: meta.locale }}>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet> */}
      <Global
        styles={css`
          body {
            margin: 0;
            background-color: ${theme.color.backgroundPrimary.toString()};
            color: ${theme.color.textPrimary.toString()};
          }
        `}
      />
      <Container>
        <Header />
        <Content>
          <TemplateBlogHeading fragmentRef={template} />
          <TemplateBlogPosts fragmentRef={template} />
        </Content>
      </Container>
    </>
  );
};

export default TemplateBlogDesktopFragment;

graphql`
  fragment TemplateBlogDesktopFragment on Page {
    id
    template {
      __typename
      ... on TemplateBlogPage {
        ...TemplateBlogHeading
        ...TemplateBlogPostsFragment
      }
    }
  }
`;
