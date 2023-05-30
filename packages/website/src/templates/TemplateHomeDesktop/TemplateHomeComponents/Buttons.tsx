import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '@boilerplate/ui-kit/src/ErrorBoundary';
import H3 from '@boilerplate/ui-kit/src/Typography/H3';
import Button from '@boilerplate/ui-kit/src/Button';
import IconEmail from '~/components/Icons/IconEmail';
import IconAngleLeft from '~/components/Icons/IconAngleLeft';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  margin: 1em;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: -1em;
  margin-right: -1em;
`;

const Buttons: React.FC = () => (
  <ErrorBoundary>
    <Section>
      <H3>Buttons</H3>
      <ButtonWrapper>
        <StyledButton variant="standard">Standard Button</StyledButton>
        <StyledButton variant="accent">Accent Button</StyledButton>
        <StyledButton variant="accent" startIcon={<IconEmail />}>
          Accent Button
        </StyledButton>
        <StyledButton variant="standard" endIcon={<IconAngleLeft />}>
          Accent Button
        </StyledButton>
      </ButtonWrapper>
    </Section>
  </ErrorBoundary>
);

export default Buttons;
