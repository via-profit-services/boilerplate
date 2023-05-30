import * as React from 'react';

import Button from '@boilerplate/ui-kit/src/Button';
import Card from '~/components/Card';

const ButtonOutlined: React.FC = () => (
  <Card color="background">
    <Button variant="outlined">Кнопка стиль «outlined»</Button>
  </Card>
);

export default ButtonOutlined;
