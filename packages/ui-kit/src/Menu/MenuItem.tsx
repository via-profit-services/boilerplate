import React from 'react';

import MenuItemInner from './MenuItemInner';

export interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly style: React.CSSProperties;
  readonly index: number;
  readonly setRowHeight: (index: number, height: number) => void;
  readonly selected: boolean;
  readonly hovered: boolean;
}

const MenuItem: React.ForwardRefRenderFunction<HTMLDivElement, MenuItemProps> = (props, ref) => {
  const { style, setRowHeight, index, children, selected, hovered, ...nativeProps } = props;
  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const heightRef = React.useRef(0);

  /**
   * Update list of sizes if height changed
   */
  React.useEffect(() => {
    if (itemRef.current) {
      const height = itemRef.current.getBoundingClientRect().height;
      if (heightRef.current !== height) {
        heightRef.current = height;
        setRowHeight(index, height);
      }
    }
  }, [setRowHeight, index]);

  return (
    <div style={style}>
      <div
        {...nativeProps}
        ref={el => {
          itemRef.current = el;
          if (ref && typeof ref === 'object') {
            ref.current = el;
          }
          if (ref && typeof ref === 'function') {
            ref(el);
          }
        }}
      >
        <MenuItemInner selected={selected} hovered={hovered}>
          {children}
        </MenuItemInner>
      </div>
    </div>
  );
};

export default React.forwardRef(MenuItem);
