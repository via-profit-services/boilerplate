import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '~/components/ErrorBoundary';
import H3 from '~/components/Typography/H3';
import SelectBox from '~/components/SelectBox';
import Menu from '~/components/Menu';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

type Item = {
  readonly id: number;
  readonly name: string;
};

const Selects: React.FC = () => {
  const [selectedItems, setSelectedItems] = React.useState<readonly Item[]>([]);
  const [multiple, setMultiple] = React.useState(false);
  const [anchorElem, setAnchorElem] = React.useState<HTMLButtonElement | null>(null);
  // const anchorElem = React.useRef<HTMLButtonElement | null>(null);
  const [itemsLength, setItemsLength] = React.useState(1200);
  const [isOpen, setOpen] = React.useState(false);

  const items = React.useMemo(() => {
    const list: Item[] = [...new Array(itemsLength).keys()].map(i => ({
      id: i,
      // name: `Item ${i}`,
      name: i % 3 === 0 ? `Item ${i} Eiusmod enim labore reprehenderit` : `Item ${i}`,
    }));

    return list;
  }, [itemsLength]);

  return (
    <ErrorBoundary>
      <Section>
        <H3>Selects</H3>
        {/* <button type="button" onClick={ev => setAnchorElem(ev.currentTarget)}>
          anchorElem
        </button>
        <Menu
          multiple={multiple}
          items={items}
          isOpen={Boolean(anchorElem)}
          value={selectedItems}
          anchorElement={anchorElem}
          // itemToString={item => item.name}
          renderItem={({ item }) => <>s{item.name}</>}
          getOptionSelected={({ item, value }) => item.id === value.id}
          onSelectItem={item => {
            console.log('selected', item);
          }}
          onRequestClose={() => {
            setAnchorElem(null);
          }}
        /> */}
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

            console.log('onSelectItem', { item });
            if (multiple && Array.isArray(item)) {
              setSelectedItems(item);
            }

            if (!multiple && !Array.isArray(item)) {
              setOpen(false);
              setSelectedItems([item as Item]);
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
