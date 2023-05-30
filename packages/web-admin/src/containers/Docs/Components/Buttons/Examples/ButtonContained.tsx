import * as React from 'react';

import Button from '@boilerplate/ui-kit/src/Button';
import Card from '~/components/Card';

const ButtonContained: React.FC = () => (
  <Card color="background">
    <Button variant="contained">Кнопка стиль «contained»</Button>
  </Card>
);

export default ButtonContained;
