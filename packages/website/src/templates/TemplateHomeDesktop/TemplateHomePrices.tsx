import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '@via-profit/ui-kit/ErrorBoundary';
import SafeFrame from '~/components/SafeFrame';
import H2 from '@via-profit/ui-kit/Typography/H2';

const PriceBox = styled.div`
  background-color: #5f5f5f;
  color: #fff;
  padding: 10em 6em;
  margin: 0 1em;
  border-radius: 0.4em;
  width: 1em;
  height: 1em;
`;

const PricesContainer = styled.div`
  background-color: ${({ theme }) => theme.color.backgroundPrimary.toString()};
  color: ${({ theme }) => theme.color.textPrimary.toString()};
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

const YellowPrice = styled(PriceBox)`
  background-color: #ffbb00;
`;
const OrangePrice = styled(PriceBox)`
  background-color: #ff7b00;
`;
const PuprlePrice = styled(PriceBox)`
  background-color: #a80255;
`;

const TemplateHomePrices: React.FC = () => (
  <ErrorBoundary>
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
  </ErrorBoundary>
);

export default TemplateHomePrices;
