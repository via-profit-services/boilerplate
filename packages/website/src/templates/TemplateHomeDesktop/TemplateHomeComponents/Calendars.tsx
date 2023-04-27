import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '~/components/ErrorBoundary';
import H3 from '~/components/Typography/H3';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

type Item = {
  readonly id: number;
  readonly name: string;
};

const Calendars: React.FC = () => {
  const [selectedItems, setSelectedItems] = React.useState<readonly Item[]>([]);
  const [multiple, setMultiple] = React.useState(false);

  return (
    <ErrorBoundary>
      <Section>
        <H3>Calendars</H3>
        Ooops. Component is not ready
      </Section>
    </ErrorBoundary>
  );
};

export default Calendars;
