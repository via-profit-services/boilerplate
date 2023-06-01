import React from 'react';
import styled from '@emotion/styled';
import ModalDrawer from '@boilerplate/ui-kit/src/Modal/ModalDrawer';

import {
  MockupSelectionBox,
  MockupImageElement,
  MockupTextElement,
  MockupSafeFrame,
} from '~/components/Mockup';

const Container = styled(MockupSelectionBox)`
  display: flex;
  border-radius: 0.4em;
  flex-direction: row;
  position: relative;
`;

const LeftSide = styled.div`
  flex: 1;
  padding-right: 5em;
  align-self: center;
  position: relative;
`;

const RightSide = styled.div`
  width: 26em;
  height: 28em;
  position: relative;
`;

const SectionSlider: React.FC = () => {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <>
      <MockupSafeFrame>
        <Container tooptip="Slider" onEdit={() => setOpenDrawer(true)}>
          <LeftSide>
            <MockupTextElement height="3em" width="100%" marginBottom="3em" />
            <MockupTextElement height="1em" width="90%" />
            <MockupTextElement height="1em" width="90%" marginTop="1em" />
            <MockupTextElement height="1em" width="60%" marginTop="1em" />
            <MockupTextElement height="1em" width="20%" marginTop="5em" />
          </LeftSide>
          <RightSide>
            <MockupImageElement height="100%" width="100%" />
          </RightSide>
        </Container>
      </MockupSafeFrame>
      <ModalDrawer isOpen={openDrawer} onRequestClose={() => setOpenDrawer(false)}>
        <div style={{ height: '60vh' }}>Edit slider</div>
      </ModalDrawer>
    </>
  );
};

export default SectionSlider;
