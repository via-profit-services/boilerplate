import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '@boilerplate/ui-kit/src/ErrorBoundary';
import H3 from '@boilerplate/ui-kit/src/Typography/H3';
import SelectBox from '@boilerplate/ui-kit/src/SelectBox';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

type Item = {
  readonly id: number;
  readonly name: string;
};

const Selects: React.FC = () => {
  const [multiple] = React.useState(false);
  const [itemsLength] = React.useState(1200);
  const [isOpen, setOpen] = React.useState(false);

  const items = React.useMemo(() => {
    const list: Item[] = [...new Array(itemsLength).keys()].map(i => ({
      id: i,
      // name: `Item ${i}`,
      name: i % 3 === 0 ? `Item ${i} Eiusmod enim labore reprehenderit` : `Item ${i}`,
    }));

    return list;
  }, [itemsLength]);
  const [selectedItems, setSelectedItems] = React.useState<readonly Item[]>([items[1]]);

  const isArrayOfItems = (item: Item | readonly Item[]): item is Item[] => Array.isArray(item);
  const isNotArrayOfItems = (item: Item | readonly Item[]): item is Item => !Array.isArray(item);

  return (
    <ErrorBoundary>
      <Section>
        <H3>Selects</H3>
        <SelectBox
          items={items}
          isOpen={isOpen}
          value={selectedItems}
          itemToString={item => item?.name || 'no name'}
          multiple={multiple}
          renderItem={({ item }) => <>{item.name}</>}
          getOptionSelected={({ item, value }) => item.id === value.id}
          onRequestOpen={() => setOpen(true)}
          onSelectItem={item => {
            if (isArrayOfItems(item)) {
              setSelectedItems(item);
            }

            if (isNotArrayOfItems(item)) {
              setOpen(false);
              setSelectedItems([item]);
            }
          }}
          onRequestClose={() => {
            setOpen(false);
          }}
        />
      </Section>
    </ErrorBoundary>
  );
};

export default Selects;
