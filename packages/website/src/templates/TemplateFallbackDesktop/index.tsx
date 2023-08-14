import React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
// import { Helmet } from 'react-helmet-async';

import Header from '~/components/Header';
import TemplateFallbackHeading from './TemplateFallbackHeading';
import TemplateFallbackContent from './TemplateFallbackContent';
import fragment, {
  TemplateFallbackDesktopFragment$key,
} from '~/relay/artifacts/TemplateFallbackDesktopFragment.graphql';

interface Props {
  readonly fragmentRef: TemplateFallbackDesktopFragment$key;
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

const TemplateFallbackDesktopFragment: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { template } = useFragment<TemplateFallbackDesktopFragment$key>(fragment, fragmentRef);

  if (template?.__typename !== 'TemplateFallbackPage') {
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
          <TemplateFallbackHeading fragmentRef={template} />
          <TemplateFallbackContent fragmentRef={template} />
        </Content>
      </Container>
    </>
  );
};

export default TemplateFallbackDesktopFragment;

graphql`
  fragment TemplateFallbackDesktopFragment on Page {
    id
    meta {
      locale
      title
      description
    }
    template {
      __typename
      ... on TemplateFallbackPage {
        ...TemplateFallbackHeading
        ...TemplateFallbackContent
      }
    }
  }
`;
