import React from 'react';
import { graphql, useFragment } from 'react-relay';

import ErrorBoundary from '~/components/ErrorBoundary';
import PaymentsBlock from '~/components/PaymentsBlock';
import fragmentSpec, {
  TemplateHomePaymentsFragment$key,
} from '~/relay/artifacts/TemplateHomePaymentsFragment.graphql';

interface TemplateHomePaymentsProps {
  readonly fragmentRef: TemplateHomePaymentsFragment$key | null;
}

const TemplateHomePayments: React.FC<TemplateHomePaymentsProps> = props => {
  const { fragmentRef } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);

  if (!fragment || !fragment.payments) {
    return null;
  }

  return (
    <ErrorBoundary>
      <PaymentsBlock fragmentRef={fragment.payments} />
    </ErrorBoundary>
  );
};

export default TemplateHomePayments;

graphql`
  fragment TemplateHomePaymentsFragment on TemplateHomePage {
    payments {
      ...PaymentsBlockFragment
    }
  }
`;
