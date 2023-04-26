import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';

import Header from '~/components/Header';
import H1 from '~/components/Typography/H1';
import H3 from '~/components/Typography/H3';
import Paragraph from '~/components/Typography/Paragraph';
import fragment, {
  TemplateHomeMobileFragment$key,
} from '~/relay/artifacts/TemplateHomeMobileFragment.graphql';
import ContentBlock from '~/components/ContentBlock';
import SafeFrame from '~/components/SafeFrame';
import H2 from '~/components/Typography/H2';

interface Props {
  readonly fragmentRef: TemplateHomeMobileFragment$key;
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`;

const PageTitle = styled(H1)`
  text-align: center;
`;

const PaymentContainer = styled.div`
  padding: 0 ${props => props.theme.grid.frameGutter}px;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  padding-top: 2em;
  padding-bottom: 2em;
`;

const PaymentIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 2em;
`;

const Icon = styled.div<{ color?: string }>`
  background-color: ${p => p.color || p.theme.colors.backgroundPrimary};
  border-radius: 100%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 1em;
  height: 1em;
  padding: 2em;
  margin: 0 1.4em;
`;

const PaymentsInner = styled(SafeFrame)`
  display: flex;
  flex-direction: column;
`;

const PaymentInfo = styled.div`
  display: flex;
`;

const PaymentImageBlock = styled.div`
  width: 50%;
  padding: 1em 1em 1em 0;
`;

const PaymentTextBlock = styled.div`
  flex: 1;
  padding: 0 0 0 1em;
`;

const PaymentImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
`;

const InfoContainer = styled.div`
  padding: 0 ${props => props.theme.grid.frameGutter}px;
  background-color: #ff841f;
  color: #fff;
  padding-top: 2em;
  padding-bottom: 2em;
`;

const InfoInner = styled(SafeFrame)`
  display: flex;
`;

const InfoLeft = styled.div`
  width: 50%;
  padding-right: 2em;
`;

const InfoRight = styled.div`
  flex: 1;
  padding-left: 2em;
`;

const InfoElem = styled.div`
  display: flex;
  margin: 1em 0;
`;

const InfoElemText = styled(Paragraph)`
  margin-left: 1em;
`;

const InfoImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
`;

const InfoTitle = styled(H2)`
  text-align: center;
  margin-bottom: 2em;
`;

const PricesContainer = styled.div`
  padding: 0 ${props => props.theme.grid.frameGutter}px;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding-top: 2em;
  padding-bottom: 2em;
`;

const PricesInner = styled(SafeFrame)`
  display: flex;
  flex-flow: column;
`;

const PricesTitle = styled(H2)`
  text-align: center;
  margin-bottom: 2em;
`;

const PricesBox = styled.div`
  display: flex;
  justify-content: center;
`;

const PriceBox = styled.div`
  background-color: #5f5f5f;
  color: #fff;
  padding: 10em 6em;
  margin: 0 1em;
  border-radius: 0.4em;
  width: 1em;
  height: 1em;
`;

const YellowPrice = styled(PriceBox)`
  background-color: #ffbb00;
`;
const OrangePrice = styled(PriceBox)`
  background-color: #ff7b00;
`;
const PuprlePrice = styled(PriceBox)`
  background-color: #a80255;
`;

const TemplateHomeMobileFragment: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { id, template } = useFragment<TemplateHomeMobileFragment$key>(fragment, fragmentRef);

  const payments = React.useMemo(() => {
    if (template?.__typename === 'TemplateHomePage' && template.payments) {
      return template.payments;
    }

    return null;
  }, [template]);

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
        <Header>ID: {id}</Header>
        {payments && (
          <PaymentContainer>
            <PaymentsInner>
              <PageTitle>
                <ContentBlock fragmentRef={payments.title} />
              </PageTitle>

              <PaymentIcons>
                {payments.icons.map(icon => (
                  <Icon key={icon.id} color={icon.color} />
                ))}
              </PaymentIcons>

              <PaymentInfo>
                <PaymentImageBlock>
                  <PaymentImage />
                </PaymentImageBlock>
                <PaymentTextBlock>
                  <H3>
                    <ContentBlock fragmentRef={payments.subtitle} />
                  </H3>
                  <ContentBlock fragmentRef={payments.content} />
                </PaymentTextBlock>
              </PaymentInfo>
            </PaymentsInner>
          </PaymentContainer>
        )}

        <InfoContainer>
          <InfoTitle>Scallable as your business</InfoTitle>
          <InfoInner>
            <InfoLeft>
              <InfoElem>
                <Icon />
                <InfoElemText>
                  Exercitation duis do sunt sit elit. Et eiusmod aliqua esse velit minim aute ad
                  occaecat eiusmod sint consequat.
                </InfoElemText>
              </InfoElem>
              <InfoElem>
                <Icon />
                <InfoElemText>
                  Tempor commodo laboris cupidatat ex. Exercitation duis do sunt sit elit.
                </InfoElemText>
              </InfoElem>
            </InfoLeft>

            <InfoRight>
              <InfoImage />
            </InfoRight>
          </InfoInner>
        </InfoContainer>

        <PricesContainer>
          <PricesInner>
            <PricesTitle>
              Register 5 units and
              <br /> get 10% discount
            </PricesTitle>
            <PricesBox>
              <YellowPrice />
              <OrangePrice />
              <PuprlePrice />
            </PricesBox>
          </PricesInner>
        </PricesContainer>
      </Container>
    </>
  );
};

export default TemplateHomeMobileFragment;

graphql`
  fragment TemplateHomeMobileFragment on Page {
    id
    meta {
      locale
      title
      description
    }

    template {
      __typename
      ... on TemplateHomePage {
        payments {
          title {
            __typename
            ...ContentBlockFragment
          }
          subtitle {
            __typename
            ...ContentBlockFragment
          }
          content {
            __typename
            ...ContentBlockFragment
          }
          icons {
            id
            color
          }
          icons {
            id
            color
          }
        }
        slider {
          slides {
            id
            image {
              __typename
              ...ContentBlockImageFragment
            }
          }
        }
      }
    }
  }
`;
