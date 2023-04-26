import React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
// import { Helmet } from 'react-helmet-async';

import Header from '~/components/Header';
import TemplateSecondHeading from './TemplateSecondHeading';
import TemplateSecondContent from './TemplateSecondContent';
import fragment, {
  TemplateSecondDesktopFragment$key,
} from '~/relay/artifacts/TemplateSecondDesktopFragment.graphql';

interface Props {
  readonly fragmentRef: TemplateSecondDesktopFragment$key;
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 20px;
  flex: 1;
`;

const TemplateSecondDesktopFragment: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { template } = useFragment<TemplateSecondDesktopFragment$key>(fragment, fragmentRef);

  if (template?.__typename !== 'TemplateSecondPage') {
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
          <TemplateSecondHeading fragmentRef={template} />
          <TemplateSecondContent fragmentRef={template} />
        </Content>
      </Container>
    </>
  );
};

export default TemplateSecondDesktopFragment;

graphql`
  fragment TemplateSecondDesktopFragment on Page {
    id
    template {
      __typename
      ... on TemplateSecondPage {
        ...TemplateSecondHeading
        ...TemplateSecondContent
      }
    }
  }
`;
