import * as React from 'react';

import ContentArea from '~/components/ContentArea';
import Card from '~/components/Card';
import Meta from '~/components/Meta';
import RenderMarkdown from '~/components/RenderMarkdown';

import DialogsOverview from './Examples/DialogsOverview';
import content from './dialogs.md';

const DocsButtons: React.FC = () => (
  <>
    <Meta header="Кнопки / UI Kit" />
    <ContentArea>
      <Card>
        <RenderMarkdown overrides={{ DialogsOverview }}>{content}</RenderMarkdown>
      </Card>
    </ContentArea>
  </>
);
export default DocsButtons;
