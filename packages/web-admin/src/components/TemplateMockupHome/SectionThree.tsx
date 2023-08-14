import React from 'react';
import styled from '@emotion/styled';
import ModalDrawer from '@via-profit/ui-kit/Modal/ModalDrawer';

import {
  MockupSelectionBox,
  MockupTextElement,
  MockupSafeFrame,
  MockupImageElement,
} from '~/components/Mockup';
import MiddleDecorations from './MiddleDecorators';

const TitleInner = styled(MockupSafeFrame)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 4em;
`;

const ContentContainer = styled.div`
  position: relative;
`;

const ContentInner = styled(MockupSafeFrame)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 3em;
  position: relative;
`;

const MockupSelectionBoxTitle = styled(MockupSelectionBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LeftSide = styled.div`
  margin-right: 4em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
`;

const RightSide = styled.div`
  width: 50%;
  min-height: 24em;
  position: relative;
`;

const ImageSelector = styled(MockupSelectionBox)`
  position: absolute;
  transform: rotateZ(10deg);
  right: calc(100% / 10);
  width: 20em;
  height: 20em;
`;

const SectionThree: React.FC = () => {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <>
      <TitleInner>
        <MockupSelectionBoxTitle
          tooptip="Title"
          marginBottom="1em"
          width="100%"
          onEdit={() => setOpenDrawer(true)}
        >
          <MockupTextElement height="2em" width="60%" />
          <MockupTextElement height="2em" width="70%" marginTop="0.4em" />
        </MockupSelectionBoxTitle>

        <MockupSelectionBox tooptip="Subtitle" width="60%" onEdit={() => setOpenDrawer(true)}>
          <MockupTextElement height="1em" width="100%" />
        </MockupSelectionBox>
      </TitleInner>

      <ContentContainer>
        <ContentInner>
          <LeftSide>
            <MockupSelectionBox
              tooptip="Subtitle"
              marginBottom="1.3em"
              onEdit={() => setOpenDrawer(true)}
            >
              <MockupTextElement height="1.4em" width="16em" />
            </MockupSelectionBox>

            <MockupSelectionBox tooptip="Subtitle" onEdit={() => setOpenDrawer(true)}>
              <MockupTextElement height="0.9em" width="22em" marginBottom="0.9em" />
              <MockupTextElement height="0.9em" width="14em" marginBottom="2.5em" />

              <MockupTextElement height="0.9em" width="22em" marginBottom="0.9em" />
              <MockupTextElement height="0.9em" width="14em" marginBottom="2.5em" />

              <MockupTextElement height="0.9em" width="22em" marginBottom="0.9em" />
              <MockupTextElement height="0.9em" width="14em" />
            </MockupSelectionBox>
          </LeftSide>

          <RightSide>
            <ImageSelector tooptip="Image" onEdit={() => setOpenDrawer(true)}>
              <MockupImageElement width="100%" height="100%" />
            </ImageSelector>
          </RightSide>
        </ContentInner>
        <MiddleDecorations />
      </ContentContainer>
      <ModalDrawer isOpen={openDrawer} onRequestClose={() => setOpenDrawer(false)}>
        <div style={{ height: '60vh' }}>Edit data</div>
      </ModalDrawer>
    </>
  );
};

export default SectionThree;
