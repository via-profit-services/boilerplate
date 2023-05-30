import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '@boilerplate/ui-kit/src/ErrorBoundary';
import H3 from '@boilerplate/ui-kit/src/Typography/H3';
import PhoneField, { PhonePayload } from '@boilerplate/ui-kit/src/PhoneField';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const PhoneElement: React.FC = () => {
  const [phoneState, setPhoneState] = React.useState<PhonePayload | null>(null);

  const isInvalid = React.useMemo(
    () =>
      Boolean(phoneState?.value && phoneState.value.length > 0 && phoneState?.isValid === false),
    [phoneState?.isValid, phoneState?.value],
  );

  return (
    <PhoneField
      fullWidth
      requiredAsterisk
      label="Enter the phone number"
      error={isInvalid}
      errorText={isInvalid ? 'Invalid phone' : undefined}
      value={phoneState?.value || ''}
      onChange={payload => setPhoneState(payload)}
    />
  );
};

const Phones: React.FC = () => (
  <ErrorBoundary>
    <Section>
      <H3>Phones</H3>
      <div>
        <PhoneElement />
      </div>
    </Section>
  </ErrorBoundary>
);

export default Phones;
