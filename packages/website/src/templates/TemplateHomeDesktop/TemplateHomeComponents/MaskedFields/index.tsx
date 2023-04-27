import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '~/components/ErrorBoundary';
import H3 from '~/components/Typography/H3';
import Paragraph from '~/components/Typography/Paragraph';
import MaskedField from '~/components/MaskedField';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const MaskedFields: React.FC = () => {
  const [value, setValue] = React.useState('123');

  return (
    <ErrorBoundary>
      <Section>
        <H3>MaskedFields</H3>
        <MaskedField
          value={value}
          onChange={({ value }) => {
            setValue(value);
          }}
        />
        <Paragraph>Value is «{value}»</Paragraph>
      </Section>
    </ErrorBoundary>
  );
};

export default MaskedFields;
