import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '@boilerplate/ui-kit/src/ErrorBoundary';
import SafeFrame from '~/components/SafeFrame';
import Paragraph from '@boilerplate/ui-kit/src/Typography/Paragraph';
import H2 from '@boilerplate/ui-kit/src/Typography/H2';

const Icon = styled.div<{ color?: string }>`
  background-color: ${p => p.color || p.theme.colors.backgroundPrimary};
  border-radius: 100%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 1em;
  height: 1em;
  padding: 2em;
  margin: 0 1.4em;
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

const TemplateHomeInfo: React.FC = () => (
  <ErrorBoundary>
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
  </ErrorBoundary>
);

export default TemplateHomeInfo;
