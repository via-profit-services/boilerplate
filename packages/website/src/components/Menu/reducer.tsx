import React from 'react';

export interface MenuState {
  readonly selectedIndexes: readonly number[];
  readonly markedIndex: number;
  readonly hoveredIndex: number;
}

export type Actions = ActionSetMenuState;

interface ActionSetMenuState {
  readonly type: 'setMenuState';
  readonly payload: Partial<MenuState>;
}

export const defaultState: MenuState = {
  selectedIndexes: [],
  markedIndex: -1,
  hoveredIndex: -1,
};

export const reducer: React.Reducer<MenuState, Actions> = (state, action) => {
  switch (action.type) {
    case 'setMenuState': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;
