import * as React from 'react';

import Meta from '~/components/Meta';
import Card from '~/components/Card';
import ContentArea from '~/components/ContentArea';

const NotFound: React.FC = () => (
  <>
    <Meta header="404 Not Found" />
    <ContentArea>
      <Card>NotFound</Card>
    </ContentArea>
  </>
);

export default NotFound;
