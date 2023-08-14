import React from 'react';
import styled from '@emotion/styled';
import ModalDrawer from '@via-profit/ui-kit/Modal/ModalDrawer';

import {
  MockupSelectionBox,
  MockupTextElement,
  MockupSafeFrame,
  MockupImageElement,
} from '~/components/Mockup';

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
  flex: 1;
`;
const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1em 0;
`;

const ItemTitleWrapper = styled.div`
  flex: 1;
`;

const SectionFour: React.FC = () => {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <>
      <Container>
        <Inner>
          <MockupSelectionBox
            tooptip="Title"
            marginBottom="1em"
            width="60%"
            onEdit={() => setOpenDrawer(true)}
          >
            <MockupTextElement height="2em" />
          </MockupSelectionBox>

          <MockupSelectionBox tooptip="Subtitle" width="40%" onEdit={() => setOpenDrawer(true)}>
            <MockupTextElement />
          </MockupSelectionBox>

          <Items tooptip="Items" onEdit={() => setOpenDrawer(true)}>
            {[...new Array(3).keys()].map(index => (
              <Item key={`item-${index}`}>
                <ItemHeader>
                  <MockupImageElement width="4em" height="4em" rounded />
                  <ItemTitleWrapper>
                    <MockupTextElement width="90%" marginLeft="1em" />
                  </ItemTitleWrapper>
                </ItemHeader>
                <MockupTextElement height="0.8em" width="90%" marginTop="0.4em" />
                <MockupTextElement height="0.8em" width="90%" marginTop="0.4em" />
                <MockupTextElement height="0.8em" width="60%" marginTop="0.4em" />
              </Item>
            ))}
          </Items>
        </Inner>
      </Container>

      <ModalDrawer isOpen={openDrawer} onRequestClose={() => setOpenDrawer(false)}>
        <div style={{ height: '60vh' }}>Edit data</div>
      </ModalDrawer>
    </>
  );
};

export default SectionFour;
