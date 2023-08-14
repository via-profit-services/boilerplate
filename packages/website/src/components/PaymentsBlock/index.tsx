import React from 'react';
import styled from '@emotion/styled';
import { graphql, useFragment } from 'react-relay';

import ContentBlock from '~/components/ContentBlock';
import SafeFrame from '~/components/SafeFrame';
import H1 from '@via-profit/ui-kit/Typography/H1';
import H3 from '@via-profit/ui-kit/Typography/H3';

import fragmentSpec, {
  PaymentsBlockFragment$key,
} from '~/relay/artifacts/PaymentsBlockFragment.graphql';

const PageTitle = styled(H1)`
  text-align: center;
`;

const PaymentContainer = styled.div`
  background-color: ${({ theme }) => theme.color.backgroundPrimary.toString()};
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
  background-color: ${p => p.color || p.theme.color.backgroundPrimary.toString()};
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
  background-color: ${({ theme }) => theme.color.backgroundPrimary.toString()};
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
`;

interface PaymentsBlockProps {
  readonly fragmentRef: PaymentsBlockFragment$key;
}

const PaymentsBlock: React.FC<PaymentsBlockProps> = props => {
  const { fragmentRef } = props;
  const { icons, title, subtitle, content } = useFragment(fragmentSpec, fragmentRef);

  return (
    <PaymentContainer>
      <PaymentsInner>
        <PageTitle>
          <ContentBlock fragmentRef={title} />
        </PageTitle>

        <PaymentIcons>
          {icons.map(icon => (
            <Icon key={icon.id} color={icon.color} />
          ))}
        </PaymentIcons>

        <PaymentInfo>
          <PaymentImageBlock>
            <PaymentImage />
          </PaymentImageBlock>
          <PaymentTextBlock>
            <H3>
              <ContentBlock fragmentRef={subtitle} />
            </H3>

            <ContentBlock fragmentRef={content} />
          </PaymentTextBlock>
        </PaymentInfo>
      </PaymentsInner>
    </PaymentContainer>
  );
};

graphql`
  fragment PaymentsBlockFragment on Payments {
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
  }
`;

export default PaymentsBlock;
