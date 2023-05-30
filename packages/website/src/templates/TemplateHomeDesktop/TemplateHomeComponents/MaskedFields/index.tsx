import React from 'react';

import ErrorBoundary from '@boilerplate/ui-kit/src/ErrorBoundary';
import H2 from '@boilerplate/ui-kit/src/Typography/H2';
import SimpleMaskedField from './SimpleMaskedField';
import PhoneMaskedField from './PhoneMaskedField';

const MaskedFields: React.FC = () => (
  <>
    <ErrorBoundary>
      <H2>MaskedFields</H2>
      <SimpleMaskedField />
      <PhoneMaskedField />
    </ErrorBoundary>
  </>
);

export default MaskedFields;
