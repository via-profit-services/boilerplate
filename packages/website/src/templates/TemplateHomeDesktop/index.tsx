import React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';

import Header from '~/components/Header';
import TemplateHomeSlider from './TemplateHomeSlider';
import TemplateHomePayments from './TemplateHomePayments';
import TemplateHomeInfo from './TemplateHomeInfo';
import TemplateHomePrices from './TemplateHomePrices';
import TemplateHomeHeading from './TemplateHomeHeading';
import fragment, {
  TemplateHomeDesktopFragment$key,
} from '~/relay/artifacts/TemplateHomeDesktopFragment.graphql';

interface Props {
  readonly fragmentRef: TemplateHomeDesktopFragment$key;
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`;

const TemplateHomeDesktopFragment: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { template } = useFragment<TemplateHomeDesktopFragment$key>(fragment, fragmentRef);

  if (template?.__typename !== 'TemplateHomePage') {
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
        <TemplateHomeSlider fragmentRef={template} />
        <TemplateHomeHeading fragmentRef={template} />
        <TemplateHomePayments fragmentRef={template} />
        <TemplateHomeInfo />
        <TemplateHomePrices />
      </Container>
    </>
  );
};

export default TemplateHomeDesktopFragment;

graphql`
  fragment TemplateHomeDesktopFragment on Page {
    template {
      __typename
      ... on TemplateHomePage {
        ...TemplateHomeHeadingFragment
        ...TemplateHomePaymentsFragment
        ...TemplateHomeSliderFragment
      }
    }
  }
`;
