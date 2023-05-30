import React from 'react';

import Menu, { MenuRef, MenuProps, OnSelectItem, Value } from '../Menu';
import SelectButton from './SelectButton';
import popperOptions from './popper-options';

type SelectBoxMenuProps<T, Multiple extends boolean | undefined = false> = Pick<
  MenuProps<T, Multiple>,
  | 'items'
  | 'value'
  | 'estimatedItemSize'
  | 'endThreshold'
  | 'overscanCount'
  | 'getOptionSelected'
  | 'onEndReached'
  | 'onSelectItem'
  | 'renderItem'
  | 'multiple'
  | 'zIndex'
  | 'onRequestClose'
  | 'isOpen'
> & {
  readonly fullWidth?: boolean;
  readonly itemToString: ItemToString<T, Multiple>;
  readonly renderInput?: (params: RenderInputProps<T, Multiple>) => React.ReactNode;
  readonly onRequestOpen: (
    event?:
      | FocusEvent
      | KeyboardEvent
      | MouseEvent
      | React.FocusEvent
      | React.KeyboardEvent
      | React.MouseEvent,
  ) => void;
};

export type ItemToString<T, Multiple> = Multiple extends undefined | false
  ? (item: T) => string
  : undefined;
export type SelectoBoxContainerRef = HTMLButtonElement;
export type RenderInputProps<T, Multiple extends boolean | undefined = undefined> = {
  readonly fullWidth?: boolean;
  readonly selected: Value<T, Multiple> | null;
  readonly inputRef: React.Ref<HTMLButtonElement>;
  readonly onClick: React.MouseEventHandler<HTMLButtonElement>;
  readonly onFocus: React.FocusEventHandler<HTMLButtonElement>;
  readonly onBlur: React.FocusEventHandler<HTMLButtonElement>;
  readonly onKeyDown: React.KeyboardEventHandler<HTMLButtonElement>;
};

export type SelectBoxRef<T> = Pick<
  MenuRef<T>,
  | 'scrollToItem'
  | 'scrollTo'
  | 'scrollToFirstSelected'
  | 'selectItem'
  | 'highlightIndex'
  | 'hightlightPrevItem'
  | 'hightlightNextItem'
  | 'hightlightFirstItem'
  | 'hightlightLastItem'
  | 'selectHightlightedItem'
  | 'updatePopper'
> & {
  readonly clear: () => void;
  readonly focus: () => void;
  readonly blur: () => void;
};

export type SelectBoxProps<
  T,
  Multiple extends boolean | undefined = undefined,
> = SelectBoxMenuProps<T, Multiple> & {
  readonly containerRef?: React.Ref<SelectoBoxContainerRef>;
  readonly notSelectedLabel?: React.ReactNode;
};

const SelectBox = React.forwardRef(
  <T, Multiple extends boolean | undefined = undefined>(
    props: SelectBoxProps<T, Multiple>,
    ref: React.Ref<SelectBoxRef<T>>,
  ) => {
    const {
      containerRef,
      itemToString,
      value,
      items,
      isOpen,
      notSelectedLabel = 'Not selected',
      estimatedItemSize,
      endThreshold,
      overscanCount,
      multiple,
      zIndex,
      fullWidth,
      renderInput,
      onRequestOpen,
      onRequestClose,
      getOptionSelected,
      onEndReached,
      onSelectItem,
      renderItem,
    } = props;
    const menuRef = React.useRef<MenuRef<T> | null>(null);
    const [currentOpen, setCurrentOpen] = React.useState(isOpen);
    const [currentValue, setCurrentValue] = React.useState(value);
    const [anchorElement, setAnchorElement] = React.useState<HTMLButtonElement | null>(null);
    const isFocusedRef = React.useRef(false);

    /**
     * API
     */
    React.useImperativeHandle(
      ref,
      () => ({
        highlightIndex: (index: number) => menuRef.current?.highlightIndex(index),
        hightlightPrevItem: () => menuRef.current?.hightlightPrevItem(),
        hightlightNextItem: () => menuRef.current?.hightlightNextItem(),
        hightlightFirstItem: () => menuRef.current?.hightlightFirstItem(),
        hightlightLastItem: () => menuRef.current?.hightlightLastItem(),
        selectHightlightedItem: () => menuRef.current?.selectHightlightedItem(),
        updatePopper: () => menuRef.current?.updatePopper(),
        scrollToFirstSelected: () => menuRef.current?.scrollToFirstSelected(),
        selectItem: (index: number) => menuRef.current?.selectItem(index),
        scrollTo: (scrollOffset: number) => menuRef.current?.scrollTo(scrollOffset),
        scrollToItem: (index: number, align?: any) => menuRef.current?.scrollToItem(index, align),
        clear: () => {
          setCurrentValue(null);
          anchorElement?.focus();
        },
        focus: () => anchorElement?.focus(),
        blur: () => anchorElement?.blur(),
      }),
      [anchorElement],
    );

    const onClickEvent = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!currentOpen) {
          onRequestOpen(event);
        } else {
          onRequestClose(event);
        }
      },
      [currentOpen, onRequestClose, onRequestOpen],
    );

    const inputKeydownEvent = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!isFocusedRef.current) {
          return;
        }

        switch (event.code) {
          case 'Enter':
          case 'NumpadEnter':
            event.preventDefault();
            menuRef.current?.selectHightlightedItem();
            break;

          case 'ArrowUp':
            {
              event.preventDefault();
              menuRef.current?.hightlightPrevItem();
            }
            break;

          case 'ArrowDown':
            {
              event.preventDefault();
              menuRef.current?.hightlightNextItem();
              if (!currentOpen) {
                onRequestOpen(event);
              }
            }

            break;

          case 'Home':
            {
              event.preventDefault();
              menuRef.current?.hightlightFirstItem();
            }

            break;

          case 'End':
            {
              event.preventDefault();
              menuRef.current?.hightlightLastItem();
            }

            break;

          case 'PageUp':
          case 'PageDown':
            event.preventDefault();

            break;

          case 'Escape':
          case 'Tab':
            onRequestClose(event);

            break;

          case 'Space':
            if (!currentOpen) {
              onRequestOpen(event);
            }
            break;

          default:
            // do nothing
            break;
        }
      },
      [currentOpen, onRequestClose, onRequestOpen],
    );

    React.useEffect(() => {
      if (value === null) {
        setCurrentValue(null);

        return;
      }

      if (multiple) {
        if (Array.isArray(value)) {
          setCurrentValue(value);
        }
        if (!Array.isArray(value)) {
          setCurrentValue([value] as Value<T, Multiple>);
        }
      }

      if (!multiple) {
        if (Array.isArray(value)) {
          setCurrentValue(value[0]);
        }
        if (!Array.isArray(value)) {
          setCurrentValue(value);
        }
      }
    }, [value, multiple]);

    React.useEffect(() => {
      setCurrentOpen(isOpen);
    }, [isOpen]);

    const onSelectItemF: OnSelectItem<T, Multiple> = React.useCallback(
      selected => {
        setCurrentValue(selected);
        if (typeof onSelectItem === 'function') {
          onSelectItem(selected);
        }

        anchorElement?.focus();
      },
      [onSelectItem, anchorElement],
    );

    const inputElement = React.useMemo(() => {
      const hasValue = currentValue && currentValue !== null;
      const valueIsNotArray = !Array.isArray(currentValue);
      const hasCustomFunc = typeof itemToString === 'function';

      const elem =
        typeof renderInput === 'function' ? (
          renderInput({
            fullWidth,
            inputRef: setAnchorElement,
            selected: currentValue,
            onBlur: () => {
              isFocusedRef.current = false;
            },
            onFocus: event => {
              isFocusedRef.current = true;
              onRequestOpen(event);
            },
            onKeyDown: inputKeydownEvent,
            onClick: onClickEvent,
          })
        ) : (
          <SelectButton
            fullWidth={fullWidth}
            isOpen={currentOpen}
            onKeyDown={inputKeydownEvent}
            onClick={onClickEvent}
            ref={el => {
              if (typeof containerRef === 'object' && containerRef !== null) {
                (containerRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
              }
              if (typeof containerRef === 'function') {
                containerRef(el);
              }

              setAnchorElement(el);
            }}
          >
            {hasValue && valueIsNotArray && hasCustomFunc
              ? itemToString(currentValue as T)
              : notSelectedLabel}
          </SelectButton>
        );

      return elem;
    }, [
      renderInput,
      inputKeydownEvent,
      onClickEvent,
      itemToString,
      onRequestOpen,
      currentValue,
      notSelectedLabel,
      containerRef,
      currentOpen,
      fullWidth,
    ]);

    return (
      <>
        {inputElement}
        <Menu
          ref={menuRef}
          items={items}
          value={currentValue}
          isOpen={currentOpen && items.length > 0}
          autofocus
          anchorElement={anchorElement}
          estimatedItemSize={estimatedItemSize}
          endThreshold={endThreshold}
          overscanCount={overscanCount}
          getOptionSelected={getOptionSelected}
          onEndReached={onEndReached}
          onSelectItem={onSelectItemF}
          renderItem={renderItem}
          multiple={multiple}
          zIndex={zIndex}
          closeOutsideClick
          popperOptions={popperOptions}
          onRequestClose={evt => {
            if (evt?.target !== anchorElement) {
              onRequestClose(evt);
              setTimeout(() => {
                anchorElement?.focus();
              }, 100);
            }
          }}
        />
      </>
    );
  },
);

SelectBox.displayName = 'SelectBox';

export default SelectBox as <T, Multiple extends boolean | undefined = false>(
  props: SelectBoxProps<T, Multiple> & { ref?: React.Ref<SelectBoxRef<T>> },
) => JSX.Element;
