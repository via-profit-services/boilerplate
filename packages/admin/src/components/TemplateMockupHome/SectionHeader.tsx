import React from 'react';
import styled from '@emotion/styled';
import ModalDrawer from '@via-profit/ui-kit/Modal/ModalDrawer';

import { MockupTextElement, MockupSafeFrame, MockupSelectionBox } from '~/components/Mockup';

const Container = styled(MockupSafeFrame)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 1em 0;
`;

const Menu = styled.div`
  flex: 1;
  display: flex;
`;

const MenuInner = styled.div`
  margin-left: 2.5em;
`;

const MenuSelector = styled(MockupSelectionBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ContactSelector = styled(MockupSelectionBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SectionHeader: React.FC = () => {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <>
      <Container>
        <MockupSelectionBox
          height="2em"
          width="8em"
          tooptip="Logotype. You can not edit this element"
          disabled
        >
          <MockupTextElement height="100%" width="100%" />
        </MockupSelectionBox>
        <Menu>
          <MenuInner>
            <MenuSelector tooptip="Configure Main menu" onEdit={() => setOpenDrawer(true)}>
              <MockupTextElement height="1em" width="3.5em" />
              <MockupTextElement height="1em" width="4em" marginLeft="1.5em" />
              <MockupTextElement height="1em" width="6em" marginLeft="1.5em" />
            </MenuSelector>
          </MenuInner>
        </Menu>
        <ContactSelector tooptip="Edit contact phone" onEdit={() => setOpenDrawer(true)}>
          <MockupTextElement height="1em" width="6em" />
        </ContactSelector>
      </Container>

      <ModalDrawer isOpen={openDrawer} onRequestClose={() => setOpenDrawer(false)}>
        <div style={{ height: '60vh' }}>Edit data</div>
      </ModalDrawer>
    </>
  );
};

export default SectionHeader;
