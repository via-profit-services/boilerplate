# Кнопки

Компонент `<Button>` создаёт кликабельную кнопку, которая может быть
использована в формах или в любом другом месте документа, который требует простой,
стандартной кнопки.

<ButtonsOverview />

Компонент исполнен в различных стилях: `contained`; `outlined`.

## Кнопка стиля «contained»

Данный стиль применяется в большинстве случаев и является стилем кнопки по умолчанию.

_Пример использования:_

<ButtonContained />


```tsx
import * as React from 'react';

import Button from '~/components/Button';

const ButtonContained: React.FC = () => (
  <Button variant="contained">Кнопка стиль «contained»</Button>
);

export default ButtonContained;
```

## Кнопка стиля «outlined»

Стиль `outlined` используется в тех случаях, когда кнопка должна присутствовать без акцентирования внимания

_Пример использования:_

<ButtonOutlined />


```tsx
import * as React from 'react';

import Button from '~/components/Button';

const ButtonOutlined: React.FC = () => (
  <Button variant="outlined">Кнопка стиль «outlined»</Button>
);

export default ButtonOutlined;

```
