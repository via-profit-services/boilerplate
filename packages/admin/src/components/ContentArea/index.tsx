import * as React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  flex: 1;
  margin: 0 auto;
  padding: 1em 1em 0 1em;
  width: 100%;
`;

const ContentArea: React.FC<any> = props => <Container {...props} />;

export default ContentArea;
