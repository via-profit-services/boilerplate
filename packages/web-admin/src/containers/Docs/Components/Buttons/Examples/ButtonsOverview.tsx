import * as React from 'react';
import styled from '@emotion/styled';

import Button from '@boilerplate/ui-kit/src/Button';
import Card from '~/components/Card';

const Grid = styled.div`
  display: flex;
  align-items: center;
  & > button {
    margin: 0 0.3em;
  }
`;

const ButtonsOverview: React.FC = () => (
  <Card color="background">
    <Grid>
      <Button variant="contained">Кнопка стиль «contained»</Button>
      <Button variant="outlined">Кнопка стиль «outlined»</Button>
    </Grid>
  </Card>
);

export default ButtonsOverview;
