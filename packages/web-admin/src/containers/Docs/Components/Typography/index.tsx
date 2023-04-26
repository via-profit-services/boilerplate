import * as React from 'react';

import ContentArea from '~/components/ContentArea';
import Card from '~/components/Card';
import Meta from '~/components/Meta';
import RenderMarkdown from '~/components/RenderMarkdown';

import TypographyOverview from './Examples/TypographyOverview';
import content from './buttons.md';

const DocsButtons: React.FC = () => (
  <>
    <Meta header="Типографика" />
    <ContentArea>
      <Card>
        <RenderMarkdown
          overrides={{
            TypographyOverview,
          }}
        >
          {content}
        </RenderMarkdown>
      </Card>
    </ContentArea>
  </>
);
export default DocsButtons;
