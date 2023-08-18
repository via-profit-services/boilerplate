import * as React from 'react';
import Surface from '@via-profit/ui-kit/Surface';
import H1 from '@via-profit/ui-kit/Typography/H1';

import Meta from '~/components/Meta';
import ContentArea from '~/components/ContentArea';

const NotFound: React.FC = () => (
  <>
    <Meta header="404 Not Found" />
    <ContentArea>
      <Surface>
        <H1>404</H1>
      </Surface>
    </ContentArea>
  </>
);

export default NotFound;
