import React from 'react';
import styled from '@emotion/styled';
import { graphql, useFragment } from 'react-relay';

import {
  MockupSelectionBox,
  MockupTextElement,
  MockupSafeFrame,
  MockupImageElement,
} from '~/components/Mockup';
import ModalDrawer from '@boilerplate/ui-kit/src/Modal/ModalDrawer';
import fragmentSpec, {
  SectionTwoTemplateMockupHomeFragment$key,
} from '~/relay/artifacts/SectionTwoTemplateMockupHomeFragment.graphql';
import ContentBlockPlainText from '~/components/ContentBlock/ContentBlockPlainText';

export interface SectionTwoProps {
  readonly fragmentRef: SectionTwoTemplateMockupHomeFragment$key;
}

const Container = styled.div`
  margin-top: 4em;
`;

const Inner = styled(MockupSafeFrame)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Items = styled(MockupSelectionBox)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 4em;
`;

const Item = styled.div`
  margin-left: 1em;
  margin-right: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

type EditAction = 'heading' | 'subtitle' | 'items';

const SectionTwo: React.FC<SectionTwoProps> = props => {
  const { fragmentRef } = props;
  const [openDrawer, setOpenDrawer] = React.useState<EditAction | null>(null);
  const templateFragment = useFragment(fragmentSpec, fragmentRef);

  return (
    <>
      <Container>
        <Inner>
          <MockupSelectionBox
            tooptip="Title"
            marginBottom="1em"
            width="60%"
            onEdit={() => setOpenDrawer('heading')}
          >
            <MockupTextElement height="2em" width="100%" />
          </MockupSelectionBox>

          <MockupSelectionBox
            tooptip="Subtitle"
            width="50%"
            onEdit={() => setOpenDrawer('subtitle')}
          >
            <MockupTextElement height="1em" width="100%" />
          </MockupSelectionBox>

          <Items tooptip="Items" onEdit={() => setOpenDrawer('items')}>
            {[...new Array(4).keys()].map(index => (
              <Item key={`item-${index}`}>
                <MockupImageElement width="7em" height="7em" rounded />
                <MockupTextElement height="1em" width="80%" marginTop="1em" />
                <MockupTextElement height="1em" width="100%" marginTop="0.4em" />
              </Item>
            ))}
          </Items>
        </Inner>
      </Container>
      <ModalDrawer isOpen={openDrawer !== null} onRequestClose={() => setOpenDrawer(null)}>
        <div style={{ height: '60vh' }}>
          {openDrawer === 'items' && <>Edit items</>}
          {openDrawer === 'subtitle' && <>Edit subtitle</>}
          {openDrawer === 'heading' && (
            <ContentBlockPlainText
              fragmentRef={templateFragment.heading}
              onUpdate={() => setOpenDrawer(null)}
            />
          )}
        </div>
      </ModalDrawer>
    </>
  );
};

export default SectionTwo;

graphql`
  fragment SectionTwoTemplateMockupHomeFragment on TemplateHomePage {
    heading {
      __typename
      ...ContentBlockPlainTextFragment
    }
  }
`;
