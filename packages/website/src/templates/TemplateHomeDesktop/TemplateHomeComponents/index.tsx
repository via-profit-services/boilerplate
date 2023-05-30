import React from 'react';
import styled from '@emotion/styled';
import Color from 'color';

import ErrorBoundary from '@boilerplate/ui-kit/src/ErrorBoundary';
import H2 from '@boilerplate/ui-kit/src/Typography/H2';
import Buttons from './Buttons';
import TextFields from './TextFields';
import Phones from './Phones';
import Menu from './Menu';
import Autocompletes from './Autocompletes';
import Selects from './Selects';
import Calendars from './Calendars';
import MaskedFields from './MaskedFields';

const InfoContainer = styled.div`
  padding: 0 ${props => props.theme.grid.frameGutter}px;
  padding-top: 2em;
  padding-bottom: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled(H2)`
  text-align: center;
  margin-bottom: 2em;
`;

const Container = styled.div`
  outline: 1px solid ${({ theme }) => Color(theme.colors.backgroundGrey).darken(0.1).rgb().string()};
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  padding: 4rem;
`;

const TemplateHomeComponents: React.FC = () => (
  <ErrorBoundary>
    <InfoContainer>
      <Container>
        <Title>Components KIT</Title>
        <Calendars />
        <MaskedFields />
        <Selects />
        <Autocompletes />
        <Buttons />
        <TextFields />
        <Phones />
        <Menu />
      </Container>
    </InfoContainer>
  </ErrorBoundary>
);

export default TemplateHomeComponents;
