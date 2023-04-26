import * as React from 'react';

import ContentArea from '~/components/ContentArea';
import Card from '~/components/Card';
import Meta from '~/components/Meta';
import RenderMarkdown from '~/components/RenderMarkdown';

import ButtonContained from './Examples/ButtonContained';
import ButtonOutlined from './Examples/ButtonOutlined';
import ButtonsOverview from './Examples/ButtonsOverview';
import content from './buttons.md';

const DocsButtons: React.FC = () => (
  <>
    <Meta header="Кнопки / UI Kit" />
    <ContentArea>
      <Card>
        <RenderMarkdown
          overrides={{
            ButtonContained,
            ButtonOutlined,
            ButtonsOverview,
          }}
        >
          {content}
        </RenderMarkdown>
      </Card>
    </ContentArea>
  </>
);
export default DocsButtons;
