import styled from '@emotion/styled';

const MockupContainer = styled.div`
  background: ${props => props.theme.colors.background.area};
  box-shadow: ${props => props.theme.shadows.elevation0};
  position: relative;
  border-radius: 1em;
  margin-bottom: 1em;
  z-index: 1;
`;

export default MockupContainer;
