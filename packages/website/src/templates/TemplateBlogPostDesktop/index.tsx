import React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
import { Link } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';

import Header from '~/components/Header';
import fragmentSpec, {
  TemplateBlogPostDesktopFragment$key,
} from '~/relay/artifacts/TemplateBlogPostDesktopFragment.graphql';
import TemplateBlogPostHeading from './TemplateBlogPostHeading';
import TemplateBlogPostImage from './TemplateBlogPostImage';

interface Props {
  readonly fragmentRef: TemplateBlogPostDesktopFragment$key;
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

const TemplateBlogPostDesktopFragment: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { template } = useFragment<TemplateBlogPostDesktopFragment$key>(fragmentSpec, fragmentRef);

  if (template?.__typename !== 'TemplateBlogPostPage') {
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
            background-color: ${theme.colors.backgroundPrimary};
            color: ${theme.colors.textPrimary};
          }
        `}
      />
      <Container>
        <Header />
        <Content>
          {template.page.parent?.path && <Link to={template.page.parent.path}>Go to blog</Link>}
          <TemplateBlogPostHeading fragmentRef={template} />
          <TemplateBlogPostImage fragmentRef={template} />
        </Content>
      </Container>
    </>
  );
};

export default TemplateBlogPostDesktopFragment;

graphql`
  fragment TemplateBlogPostDesktopFragment on Page {
    id
    template {
      __typename
      ... on TemplateBlogPostPage {
        page {
          parent {
            path
          }
        }
        ...TemplateBlogPostHeading
        ...TemplateBlogPostImage
      }
    }
  }
`;
