import React from 'react';
import ReactDOM from 'react-dom';
import {
  VariableSizeList as VirtualizedList,
  ListOnScrollProps,
  Align as VirtListAlign,
} from 'react-window';
import { usePopper } from 'react-popper';
import AutoSizer from 'react-virtualized-auto-sizer';

import options from './popper-options';
import MenuItem from './MenuItem';
import MenuWrapper from './MenuWrapper';
import reducer, { defaultState } from './reducer';

export interface MenuProps<T, Multiple extends boolean | undefined = undefined> {
  /**
   * List of items
   */
  readonly items: readonly T[];

  /**
   * Current value\
   * If `Menu` component has `multiple` property then value must be an array of items
   */
  readonly value: Value<T, Multiple> | null;

  /**
   * Estimated item height. Need to calculate menu height\
   * \
   * **Default**: `50`
   */
  readonly estimatedItemSize?: number;

  /**
   * Menu open state
   */
  readonly isOpen?: boolean;

  /**
   * The threshold is the number of items from the end of the list,
   * upon reaching which the additional loading of new items will begin\
   * \
   * **Default**: `10`
   */
  readonly endThreshold?: number;

  /**
   * The thresholdPercent is the persont of items from the end of the list in percents value\
   * Dependent of `onEndReached` property\
   * \
   * **Default**: `30`
   */
  readonly thresholdPercent?: number;

  /**
   * Autofocus list after menu open\
   * Dependent of `onEndReached` property\
   * \
   * **Default**: `true`
   */
  readonly autofocus?: boolean;

  /**
   * tabindex property for the list. Tabindex is required to be able to set focus on a list item\
   * \
   * **Default**: `-1`
   */
  readonly tabIndex?: number;

  /**
   * The delay in milliseconds before the focus moves to the list at the time of its opening.\
   * Used only if `autofocus` property is true\
   * \
   * **Default**: `250`
   */
  readonly autofocusDelay?: number;

  /**
   * The number of items to render outside of the visible area. This property can be important for two reasons:
   *
   * - Overscanning by one row allows the tab key to focus on the next (not yet visible) item.
   * - Overscanning slightly can reduce or prevent a flash of empty space when a user first starts scrolling.
   *
   * Note that overscanning too much can negatively impact performance.\
   * \
   * **Default**: `1`
   */
  readonly overscanCount?: number;

  /**
   * An HTML element. It's used to set the position of the menu.
   */
  readonly anchorElement: HTMLElement | null;

  /**
   * Close list if click outside of list\
   * \
   * **Default**: `true`
   */
  readonly closeOutsideClick?: boolean;

  /**
   * Allow the multiple selection
   */
  readonly multiple?: Multiple;

  /**
   * z-index property\
   * \
   * **Default**: `1`
   */
  readonly zIndex?: number;

  /**
   * @popperjs/core component options\
   * \
   * **Default**: used special preset
   */
  readonly popperOptions?: typeof options;

  /**
   * An element for the React.createPortal node\
   * \
   * **Default**: `document.body`
   */
  readonly portalNode?: (() => HTMLElement) | HTMLElement;

  /**
   * The reference of the outer list HTML element
   */
  readonly outerRef?: React.MutableRefObject<OuterListType | null>;

  /**
   * The API reference of the virtualized list
   */
  readonly listRef?: React.MutableRefObject<VirtualizedListType<T> | null>;

  /**
   * A function that determines which of the elements is currently selected
   */
  readonly getOptionSelected?: GetOptionSelected<T>;

  /**
   * The function that will be called when the list reaches the end
   */
  readonly onEndReached?: () => void;

  /**
   * Called when item selected
   */
  readonly onSelectItem?: OnSelectItem<T, Multiple>;

  /**
   * A function that renders each list item
   */
  readonly renderItem?: RenderItem<T>;

  /**
   * The function that will be called at the moment when you want to close the menu
   */
  readonly onRequestClose: OnRequestClose;
}

export type MenuRef<T> = {
  /**
   * Scroll to specified item index
   */
  scrollToItem: VirtualizedListType<T>['scrollToItem'];

  /**
   * Scroll by offset (px)
   */
  scrollTo: VirtualizedListType<T>['scrollTo'];

  /**
   * Scroll list to first of selected item
   */
  scrollToFirstSelected: () => void;

  /**
   * Select specified item by index
   */
  selectItem: (index: number) => void;

  /**
   * Hightlight specified item by index
   */
  highlightIndex: (index: number) => void;

  /**
   * Highlight the previous item relative to the currently highlighted one
   */
  hightlightPrevItem: () => void;

  /**
   * Highlight the next item relative to the currently highlighted one
   */
  hightlightNextItem: () => void;

  /**
   * Highlight the first item in list
   */
  hightlightFirstItem: () => void;

  /**
   * Highlight the last item in list
   */
  hightlightLastItem: () => void;

  /**
   * Select hightlighted item
   */
  selectHightlightedItem: () => void;

  /**
   * Force re-render popper element
   */
  updatePopper: () => void;

  /**
   * Force set focus to list
   */
  focus: () => void;
};

export type VirtualizedListType<T> = VirtualizedList<T>;
export type OuterListType = HTMLDivElement;
export type Value<T, Multiple> = Multiple extends undefined | undefined ? T : readonly T[];
export type GetOptionSelected<T> = (payload: { readonly item: T; readonly value: T }) => boolean;
export type RenderItem<T> = (payload: {
  readonly item: T;
  readonly index: number;
}) => React.ReactNode;

export type OnSelectItem<T, Multiple extends boolean | undefined = undefined> = (
  value: Value<T, Multiple>,
) => void;

export type OnRequestClose = (
  event?:
    | React.KeyboardEvent<HTMLElement>
    | React.MouseEvent<HTMLElement>
    | KeyboardEvent
    | MouseEvent,
) => void;

const Menu = React.forwardRef(
  <T, Multiple extends boolean | undefined = undefined>(
    props: MenuProps<T, Multiple>,
    ref: React.Ref<MenuRef<T>>,
  ) => {
    const {
      items,
      value,
      isOpen,
      estimatedItemSize = 50,
      endThreshold = 10,
      thresholdPercent = 30,
      autofocusDelay = 250,
      autofocus = true,
      closeOutsideClick = true,
      overscanCount = 1,
      zIndex = 1,
      tabIndex = -1,
      portalNode = typeof window !== 'undefined' ? window.document.body : undefined,
      outerRef,
      listRef,
      anchorElement,
      multiple,
      popperOptions,
      onSelectItem,
      onEndReached,
      getOptionSelected,
      renderItem,
      onRequestClose,
    } = props;

    const getSelectedIndexes = React.useCallback(() => {
      const idx = new Set<number>();

      if (typeof value === 'object' && value !== null) {
        if (typeof getOptionSelected === 'function') {
          if (Array.isArray(value)) {
            value.forEach(v => {
              idx.add(items.findIndex(item => getOptionSelected({ item, value: v })));
            });
          }

          if (!Array.isArray(value)) {
            idx.add(items.findIndex(item => getOptionSelected({ item, value: value as T })));
          }
        }

        if (Array.isArray(value)) {
          value.forEach(v => {
            idx.add(items.findIndex(item => JSON.stringify(item) === JSON.stringify(v)));
          });
        } else {
          idx.add(items.findIndex(item => JSON.stringify(item) === JSON.stringify(value)));
        }
      }

      return [...idx];
    }, [getOptionSelected, items, value]);

    const [domLoaded, setDomLoaded] = React.useState(false);
    const [menuIsOpen, setMenuOpen] = React.useState(Boolean(isOpen));
    const [currentAnchorElement, setAnchorElement] = React.useState(anchorElement);
    const isOpenRef = React.useRef(menuIsOpen);
    const dimensionsRef = React.useRef({ width: 0, height: 0 });
    const sizeMapRef = React.useRef(new Map<number, number>());
    const listVirtRef = React.useRef<VirtualizedListType<T> | null>(null);
    const listOuterRef = React.useRef<OuterListType | null>(null);
    const menuWrapperRef = React.useRef<HTMLDivElement | null>(null);
    const [{ selectedIndexes, markedIndex, hoveredIndex }, dispatch] = React.useReducer(reducer, {
      ...defaultState,
      selectedIndexes: getSelectedIndexes(),
      markedIndex: -1,
    });

    const selectedIndexesRef = React.useRef(selectedIndexes);
    const [popperElement, setPopperElement] = React.useState<HTMLDivElement | null>(null);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const { styles, attributes, forceUpdate } = usePopper(
      currentAnchorElement,
      popperElement,
      popperOptions || options,
    );

    /**
     * Client render detection
     */
    React.useEffect(() => {
      setDomLoaded(true);
    }, []);

    /**
     * Scroll to first of selected item
     */
    const scrollToFirstSelected = React.useCallback(() => {
      const indexes = getSelectedIndexes();
      // Sort array of indexes by DESC and get the index
      const index = indexes.length ? [...indexes.sort()][0] : -1;
      dispatch({
        type: 'setMenuState',
        payload: {
          markedIndex: index,
        },
      });
      listVirtRef.current?.scrollToItem(index);
    }, [getSelectedIndexes]);

    /**
     * Select specified item by index
     */
    const selectItem = React.useCallback(
      (index: number) => {
        const item = items[index];

        if (!item) {
          return;
        }

        if (typeof onSelectItem === 'function') {
          // For multiple
          if (multiple && Array.isArray(value)) {
            const selItems = new Set<Value<T, Multiple>>(value);

            if (selectedIndexes.includes(index)) {
              selItems.delete(item as Value<T, Multiple>);
            } else {
              selItems.add(item as Value<T, Multiple>);
            }

            onSelectItem([...selItems] as Value<T, Multiple>);
          } else {
            // For single
            onSelectItem(item as Value<T, Multiple>);
          }
        }
      },
      [items, onSelectItem, selectedIndexes, value, multiple],
    );

    /**
     * Highlight specified item by index
     */
    const highlightIndex = React.useCallback(
      (index: number) => {
        dispatch({
          type: 'setMenuState',
          payload: {
            markedIndex: items[index] ? index : -1,
          },
        });
      },
      [items],
    );

    const hightlightPrevItem = React.useCallback(() => {
      const index = Math.max(markedIndex - 1, 0);
      highlightIndex(index);
      listVirtRef.current?.scrollToItem(index);
    }, [markedIndex, highlightIndex]);

    const hightlightNextItem = React.useCallback(() => {
      const index = Math.min(markedIndex + 1, items.length);
      highlightIndex(index);
      listVirtRef.current?.scrollToItem(index);
    }, [markedIndex, items.length, highlightIndex]);

    const hightlightFirstItem = React.useCallback(() => {
      const index = 0;
      highlightIndex(index);
      listVirtRef.current?.scrollToItem(index);
    }, [highlightIndex]);

    const hightlightLastItem = React.useCallback(() => {
      const index = items.length - 1;
      highlightIndex(index);
      listVirtRef.current?.scrollToItem(index);
    }, [highlightIndex, items.length]);

    const selectHightlightedItem = React.useCallback(() => {
      if (markedIndex > -1) {
        selectItem(markedIndex);
      }
    }, [markedIndex, selectItem]);

    /**
     * API
     */
    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => menuWrapperRef.current?.focus(),
        scrollToItem: (index: number, align?: VirtListAlign) =>
          listVirtRef.current?.scrollToItem(index, align),
        scrollTo: (scrollOffset: number) => listVirtRef.current?.scrollTo(scrollOffset),
        scrollToFirstSelected,
        selectItem: selectItem,
        updatePopper: () => typeof forceUpdate === 'function' && forceUpdate(),
        highlightIndex,
        hightlightPrevItem,
        hightlightNextItem,
        hightlightFirstItem,
        hightlightLastItem,
        selectHightlightedItem,
      }),
      [
        scrollToFirstSelected,
        selectItem,
        highlightIndex,
        hightlightPrevItem,
        hightlightNextItem,
        hightlightFirstItem,
        hightlightLastItem,
        selectHightlightedItem,
        forceUpdate,
      ],
    );

    /**
     * To write row height (size in px) into the cached map
     * and fire re-render action of virtualized list
     */
    const setRowHeight = React.useCallback((index: number, height: number) => {
      sizeMapRef.current.set(index, height);
      listVirtRef.current?.resetAfterIndex(index);
    }, []);

    /**
     * Update achnor
     */
    React.useEffect(() => {
      if (anchorElement !== currentAnchorElement) {
        setAnchorElement(anchorElement);
      }
    }, [anchorElement, currentAnchorElement]);

    const dimensions = React.useMemo(() => {
      const dimensions = { ...dimensionsRef.current };
      menuIsOpen;
      const MAX_HEIGHT = 360;
      let size = 0;
      for (let index = 0; index < items.length; index++) {
        if (index > 60) {
          break;
        }

        size += sizeMapRef.current.get(index) || estimatedItemSize;
      }

      if (size > 0) {
        dimensions.height = Math.min(MAX_HEIGHT, size);
      }

      if (currentAnchorElement) {
        dimensions.width = currentAnchorElement.getBoundingClientRect().width;
      }

      dimensionsRef.current = dimensions;

      return dimensions;
    }, [currentAnchorElement, items, estimatedItemSize, menuIsOpen]);

    const onScroll = React.useCallback(
      ({ scrollOffset, scrollDirection }: ListOnScrollProps) => {
        if (typeof onEndReached !== 'function') {
          return;
        }

        // Detect the end of the reached
        if (listOuterRef.current && scrollDirection === 'forward') {
          // The threshold is the number of items from the end of the list,
          // upon reaching which the additional loading of new items will begin
          const threshold = (endThreshold / 100) * thresholdPercent;
          // const threshold = 10;
          const offset = listOuterRef.current.scrollHeight - listOuterRef.current.clientHeight;
          const lastItemsHeight = Array.from(items)
            .slice(-threshold)
            .reduce(
              (totalHeight, _edge, index) =>
                totalHeight + (sizeMapRef.current.get(index) || estimatedItemSize),
              0,
            );
          if (scrollOffset >= offset - lastItemsHeight) {
            onEndReached();
          }
        }
      },
      [onEndReached, endThreshold, thresholdPercent, items, estimatedItemSize],
    );

    /**
     * Keyboard events of menu list container.
     * Note: Moved selection up and down while keys pressed
     */
    const listKeydownEvent = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        if (!menuIsOpen) {
          return;
        }

        switch (event.code) {
          case 'Enter':
          case 'NumpadEnter':
          case 'Tab':
            event.preventDefault();
            if (markedIndex > -1) {
              selectItem(markedIndex);
            }
            break;

          case 'ArrowUp':
            {
              event.preventDefault();
              hightlightPrevItem();
            }
            break;

          case 'ArrowDown':
            {
              event.preventDefault();
              hightlightNextItem();
            }

            break;

          case 'Home':
            {
              event.preventDefault();
              hightlightFirstItem();
            }

            break;

          case 'End':
            {
              event.preventDefault();
              hightlightLastItem();
            }

            break;

          case 'PageUp':
          case 'PageDown':
          case 'Space':
            event.preventDefault();

            break;

          case 'Escape':
            event.preventDefault();
            onRequestClose(event);

            break;

          default:
            // do nothing
            break;
        }
      },
      [
        markedIndex,
        menuIsOpen,
        onRequestClose,
        selectItem,
        hightlightPrevItem,
        hightlightNextItem,
        hightlightFirstItem,
        hightlightLastItem,
      ],
    );

    /**
     * Invoked `renderItem` function if that passed,
     * otherwise used another render method
     */
    const renderItemFn: RenderItem<T> = React.useCallback(
      item => (typeof renderItem === 'function' ? renderItem(item) : JSON.stringify(item)),
      [renderItem],
    );

    // eslint-disable-next-line arrow-body-style
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    React.useEffect(() => {
      const windowResizeEvent = (_event: UIEvent) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          if (forceUpdate) {
            forceUpdate();
          }
        }, 100);
      };

      const mouseDownEvent = (event: MouseEvent) => {
        if (!menuIsOpen) {
          return;
        }

        let parentElem = event.target as Node;
        let needToClose = true;

        while (parentElem && 'parentNode' in parentElem) {
          if (parentElem === popperElement) {
            needToClose = false;
            break;
          }
          parentElem = parentElem.parentNode as Node;
        }

        if (needToClose) {
          onRequestClose(event);
        }
      };
      if (closeOutsideClick) {
        window.document.addEventListener('mousedown', mouseDownEvent);
      }
      window.document.addEventListener('resize', windowResizeEvent);

      return () => {
        if (closeOutsideClick) {
          window.document.removeEventListener('mousedown', mouseDownEvent);
        }

        window.document.removeEventListener('resize', windowResizeEvent);
      };
    }, [forceUpdate, menuIsOpen, popperElement, onRequestClose, closeOutsideClick]);

    /**
     * Toggle menu open
     */
    React.useEffect(() => {
      if (isOpenRef.current !== isOpen) {
        isOpenRef.current = Boolean(isOpen);
        setMenuOpen(Boolean(isOpen));
        if (isOpen) {
          scrollToFirstSelected();

          if (autofocus) {
            setTimeout(() => {
              menuWrapperRef.current?.focus();
            }, autofocusDelay);
          }
        }

        // Reset indexes
        if (!isOpen) {
          listVirtRef.current?.scrollToItem(0);
          dispatch({
            type: 'setMenuState',
            payload: {
              markedIndex: -1,
              hoveredIndex: -1,
            },
          });
        }
      }
    }, [
      getSelectedIndexes,
      scrollToFirstSelected,
      isOpen,
      autofocus,
      popperElement,
      autofocusDelay,
    ]);

    /**
     * Mark selected items by values
     */
    React.useEffect(() => {
      const indexes = getSelectedIndexes();

      // If elements in selectedIndexesRef and indexes are not equale
      if (
        (selectedIndexesRef.current.length === indexes.length &&
          selectedIndexesRef.current.every(value => indexes.includes(value))) === false
      ) {
        selectedIndexesRef.current = indexes;
        dispatch({
          type: 'setMenuState',
          payload: {
            selectedIndexes: indexes,
          },
        });
      }
    }, [value, getSelectedIndexes]);

    return !domLoaded
      ? null
      : ReactDOM.createPortal(
          <div
            {...attributes.popper}
            ref={setPopperElement}
            style={{
              ...styles.popper,
              zIndex,
            }}
          >
            {menuIsOpen && (
              <MenuWrapper
                isOpen={menuIsOpen}
                ref={menuWrapperRef}
                tabIndex={tabIndex}
                dimensions={dimensions}
                onKeyDown={listKeydownEvent}
              >
                <AutoSizer>
                  {({ width, height }) => (
                    <VirtualizedList
                      onScroll={onScroll}
                      width={width || 0}
                      height={height || 0}
                      itemCount={items.length}
                      overscanCount={overscanCount}
                      itemSize={index => sizeMapRef.current.get(index) || estimatedItemSize}
                      estimatedItemSize={estimatedItemSize}
                      ref={elem => {
                        listVirtRef.current = elem;
                        if (listRef) {
                          listRef.current = elem;
                        }
                      }}
                      outerRef={elem => {
                        listOuterRef.current = elem;
                        if (outerRef) {
                          outerRef.current = elem;
                        }
                      }}
                    >
                      {({ index, style }) => {
                        const item = items[index];

                        return (
                          <MenuItem
                            index={index}
                            style={style}
                            setRowHeight={setRowHeight}
                            selected={selectedIndexes.includes(index)}
                            hovered={hoveredIndex === index || markedIndex === index}
                            onMouseEnter={() => {
                              if (index !== hoveredIndex) {
                                dispatch({
                                  type: 'setMenuState',
                                  payload: { hoveredIndex: index, markedIndex: -1 },
                                });
                              }
                            }}
                            onMouseLeave={() => {
                              if (index === hoveredIndex) {
                                dispatch({
                                  type: 'setMenuState',
                                  payload: { hoveredIndex: -1, markedIndex: -1 },
                                });
                              }
                            }}
                            onClick={() => selectItem(index)}
                          >
                            {renderItemFn({ item, index })}
                          </MenuItem>
                        );
                      }}
                    </VirtualizedList>
                  )}
                </AutoSizer>
              </MenuWrapper>
            )}
          </div>,
          typeof portalNode === 'function' ? portalNode() : portalNode || window.document.body,
        );
  },
);

Menu.displayName = 'Menu';

export default Menu as <T, Multiple extends boolean | undefined = undefined>(
  props: MenuProps<T, Multiple> & { ref?: React.Ref<MenuRef<T>> },
) => JSX.Element;
