import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '~/components/ErrorBoundary';
import H3 from '~/components/Typography/H3';
import MaskedField from '~/components/MaskedField';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const vinNumberMask = [
  /[A-HJ-NPR-Z0-9]/i,
  /[A-HJ-NPR-Z0-9]/i,
  /[A-HJ-NPR-Z0-9]/i,
  '-',
  /[A-HJ-NPR-Z0-9]/i,
  /[A-HJ-NPR-Z0-9]/i,
  /[A-HJ-NPR-Z0-9]/i,
  /[A-HJ-NPR-Z0-9]/i,
  /[A-HJ-NPR-Z0-9]/i,
  /[A-HJ-NPR-Z0-9]/i,
  /[A-HJ-NPR-Z0-9]/i,
  /[A-HJ-NPR-Z0-9]/i,
  '-',
  /[A-HJ-NPR-Z0-9]/i,
  /[A-HJ-NPR-Z0-9]/i,
  /[0-9]/i,
  /[0-9]/i,
  /[0-9]/i,
  /[0-9]/i,
];

const SimpleMaskedField: React.FC = () => {
  const [value, setValue] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);

  return (
    <ErrorBoundary>
      <Section>
        <H3>VIN number</H3>
        <MaskedField
          fullWidth
          mask={vinNumberMask}
          label="Type a VIN number like this: «4Y1-SL65848Z-411439»"
          placeholder="4Y1-SL65848Z-411439"
          value={value}
          error={value !== '' && !isValid}
          errorText={!isValid ? 'Invalid VIN number' : undefined}
          transform={v => v.toUpperCase()}
          onChange={({ text, isValid }) => {
            setValue(text);
            setIsValid(isValid);
          }}
        />
      </Section>
    </ErrorBoundary>
  );
};

export default SimpleMaskedField;
