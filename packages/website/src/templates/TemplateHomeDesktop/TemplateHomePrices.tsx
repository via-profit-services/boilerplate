import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '@boilerplate/ui-kit/src/ErrorBoundary';
import SafeFrame from '~/components/SafeFrame';
import H2 from '@boilerplate/ui-kit/src/Typography/H2';

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
