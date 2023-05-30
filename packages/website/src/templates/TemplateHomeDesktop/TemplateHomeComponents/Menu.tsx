import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '@boilerplate/ui-kit/src/ErrorBoundary';
import H3 from '@boilerplate/ui-kit/src/Typography/H3';
import Paragraph from '@boilerplate/ui-kit/src/Typography/Paragraph';
import Button from '@boilerplate/ui-kit/src/Button';
import Menu, { MenuRef } from '@boilerplate/ui-kit/src/Menu';
import TestComp, { TestCompRef } from './TestComp';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const ChipBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Chip = styled.div`
  margin: 0.43em;
  padding: 0.3em 0.6em;
  font-size: 0.8em;
  border: 2px solid ${({ theme }) => theme.colors.accentPrimary};
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  max-width: 10em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
`;

type Item = {
  readonly id: number;
  readonly name: string;
};

const TestElem: React.FC = () => {
  const testRef = React.useRef<TestCompRef<Item> | null>(null);

  return (
    <>
      <TestComp ref={testRef} value={{ id: 3, name: 'Info' }} renderValue={value => value.name} />
      <Button onClick={() => testRef.current?.setValue({ id: 4, name: 'red' })}>Set Red</Button>
      <Button onClick={() => testRef.current?.setValue({ id: 6, name: 'blue' })}>Set Blue</Button>
    </>
  );
};

const MenuElement: React.FC = () => {
  const [anchorElement, setAnchorElement] = React.useState<HTMLButtonElement | null>(null);
  const [selectedItems, setSelectedItems] = React.useState<readonly Item[]>([]);
  const [isMultiple, setMultiple] = React.useState(false);
  const [itemsLength, setItemsLength] = React.useState(1200);
  const menuRef = React.useRef<MenuRef<(typeof selectedItems)[0]> | null>(null);

  const items = React.useMemo(() => {
    const list: Item[] = [...new Array(itemsLength).keys()].map(i => ({
      id: i,
      // name: `Item ${i}`,
      name: i % 3 === 0 ? `Item ${i} Eiusmod enim labore reprehenderit` : `Item ${i}`,
    }));

    return list;
  }, [itemsLength]);

  const isArrayOfItems = (item: Item | readonly Item[]): item is Item[] =>
    isMultiple && Array.isArray(item);
  const isNotArrayOfItems = (item: Item | readonly Item[]): item is Item =>
    !isMultiple && !Array.isArray(item);

  return (
    <div>
      <Button onClick={() => setItemsLength(4)}>Set 4 items only</Button>
      <Button onClick={() => setItemsLength(1200)}>Set 1200 items size</Button>
      <Button onClick={() => setItemsLength(6000)}>Set 6000 items only</Button>
      <Button variant="accent" onClick={() => menuRef.current?.focus()}>
        Focus to menu
      </Button>
      <Button
        onClick={() => {
          if (isMultiple && selectedItems.length > 1) {
            setSelectedItems([selectedItems[0]]);
          }
          setMultiple(!isMultiple);
        }}
      >
        Multiple is {isMultiple ? 'On' : 'Off'}
      </Button>
      <Button
        variant="accent"
        onClick={event => {
          setAnchorElement(current => (current ? null : event.currentTarget));
          // setOpen(!isOpen);
        }}
      >
        {isMultiple ? 'Toggle multiple menu' : 'Toggle menu'}
      </Button>
      <Paragraph>Selected:</Paragraph>
      <ChipBox>
        {selectedItems !== null && selectedItems.length ? (
          <>
            {selectedItems.map(item => (
              <Chip
                key={item.id}
                title="Delete"
                onClick={() => setSelectedItems(selItems => selItems.filter(i => i.id !== item.id))}
              >
                {item.name}
              </Chip>
            ))}
          </>
        ) : (
          'nothing'
        )}
      </ChipBox>

      <Menu
        ref={menuRef}
        anchorElement={anchorElement}
        isOpen={Boolean(anchorElement)}
        value={selectedItems}
        multiple={isMultiple}
        items={items}
        renderItem={({ item }) => <>{item.name}</>}
        getOptionSelected={({ item, value }) => item.id === value.id}
        onSelectItem={item => {
          if (isArrayOfItems(item)) {
            setSelectedItems(item);
          }

          if (isNotArrayOfItems(item)) {
            setAnchorElement(null);
            anchorElement?.focus();
            if (typeof item === 'object') {
              setSelectedItems([item]);
            }
          }
        }}
        onRequestClose={() => {
          anchorElement?.focus();
          setAnchorElement(null);
        }}
      />
    </div>
  );
};

const Menus: React.FC = () => (
  <ErrorBoundary>
    <Section>
      <H3>Menu</H3>
      <MenuElement />
      <TestElem />
    </Section>
  </ErrorBoundary>
);

export default Menus;
