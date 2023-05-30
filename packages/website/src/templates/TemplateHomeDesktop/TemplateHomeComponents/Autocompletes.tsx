import React from 'react';
import styled from '@emotion/styled';

import countries from './countries.json';
import ErrorBoundary from '@boilerplate/ui-kit/src/ErrorBoundary';
import H3 from '@boilerplate/ui-kit/src/Typography/H3';
import Button from '@boilerplate/ui-kit/src/Button';
import Autocomplete, { AutocompleteRef } from '@boilerplate/ui-kit/src/Autocomplete';
import TextField from '@boilerplate/ui-kit/src/TextField';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: row;
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
  readonly code: string;
  readonly name: string;
};

const AutocompleteElement: React.FC = () => {
  const anchorElementRef = React.useRef<HTMLDivElement | null>(null);
  const [selectedItems, setSelectedItems] = React.useState<readonly Item[]>([]);
  const [isMultiple, setMultiple] = React.useState(false);
  const [isOpen, setOpen] = React.useState(false);
  const autocompleteRef = React.useRef<AutocompleteRef<Item> | null>(null);
  const items = countries;

  const isArrayOfItems = (item: Item | readonly Item[]): item is Item[] =>
    isMultiple && Array.isArray(item);
  const isNotArrayOfItems = (item: Item | readonly Item[]): item is Item =>
    !isMultiple && !Array.isArray(item);

  return (
    <>
      <Button
        onClick={() => {
          if (isMultiple && selectedItems.length > 1) {
            setSelectedItems([selectedItems[0]]);
          }
          setMultiple(!isMultiple);
        }}
      >
        Multiple {isMultiple ? 'On' : 'Off'}
      </Button>

      <Autocomplete
        ref={autocompleteRef}
        isOpen={isOpen}
        estimatedItemSize={32}
        multiple={isMultiple}
        renderItem={({ item }) => <>{item.name}</>}
        items={items}
        getOptionSelected={({ item, value }) => item.code === value.code}
        value={selectedItems}
        filterItems={(variants, { query }) =>
          variants.filter(c => {
            const candidade = c.name.trim().toLowerCase();

            return candidade.indexOf(query) !== -1;
          })
        }
        itemToString={item => item.name}
        onSelectItem={item => {
          if (isArrayOfItems(item)) {
            setSelectedItems(item);
          }

          if (isNotArrayOfItems(item)) {
            anchorElementRef.current?.focus();
            setSelectedItems([item]);
            setOpen(false);
          }
        }}
        renderInput={({ selected, ...inputProps }) => (
          <>
            <InputBox>
              <TextField ref={anchorElementRef} {...inputProps} />
              <Button
                onMouseDown={event => {
                  event.preventDefault();
                  autocompleteRef.current?.blur();
                  autocompleteRef.current?.focus();
                }}
              >
                ^
              </Button>
              <Button
                onClick={() => {
                  autocompleteRef.current?.clear();
                }}
              >
                X
              </Button>
            </InputBox>
            {Array.isArray(selected) && (
              <ChipBox>
                {(selected as Item[]).map(selecedeItem => (
                  <Chip
                    key={selecedeItem.code}
                    onClick={() => {
                      setSelectedItems(s => s.filter(s => s.code !== selecedeItem.code));
                      autocompleteRef.current?.focus();
                      autocompleteRef.current?.clearInput();
                    }}
                  >
                    {selecedeItem.code}
                  </Chip>
                ))}
              </ChipBox>
            )}
          </>
        )}
        onRequestOpen={() => setOpen(true)}
        onRequestClose={event => {
          const isKeybordEvent = (e: typeof event): e is KeyboardEvent => e?.type === 'keydown';
          if (isKeybordEvent(event)) {
            if (event.code === 'Escape') {
              anchorElementRef.current?.focus();
            }
          }
          setOpen(false);
        }}
      />
    </>
  );
};

const Autocompletes: React.FC = () => (
  <ErrorBoundary>
    <Section>
      <H3>Autocomplete</H3>
      <AutocompleteElement />
    </Section>
  </ErrorBoundary>
);

export default Autocompletes;
