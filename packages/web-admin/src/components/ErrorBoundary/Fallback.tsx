import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  border-radius: inherit;
  background-color: #8b0101;
  color: #f5e7e7;
`;

const Fallback: React.FC = () => (
  <>
    <Global
      styles={css`
        body {
          margin: 0;
        }
      `}
    />
    <Container>
      <h1>It looks like our server has broken down</h1>
      <p>We&apos;re already fixing it. We are waiting for you later</p>
    </Container>
  </>
);

export default Fallback;
