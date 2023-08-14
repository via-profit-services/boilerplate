import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import TextField from '@via-profit/ui-kit/TextField';
import { pagesListVariablesActions } from '~/redux/slicers/pagesList';

const ToolbarContainer = styled.div`
  padding: 1em;
  background-color: ${({ theme }) => theme.color.surface.toString()};
`;

const selector = createSelector(
  (store: ReduxStore) => store.pagesListVariables.search?.[0]?.query || '',
  query => ({ query }),
);

const Toolbar: React.FC = () => {
  const { query } = useSelector(selector);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = React.useState(query);
  const inputValueRef = React.useRef(inputValue);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (query !== inputValueRef.current) {
      setInputValue(query);
    }
  }, [query]);

  /**
   * Component will unmount
   */
  React.useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return (
    <ToolbarContainer>
      <TextField
        label="Search page by name"
        value={inputValue}
        onChange={event => {
          const inputString = event.currentTarget.value;
          setInputValue(inputString);

          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }

          timerRef.current = setTimeout(() => {
            const query = inputString.trim();
            dispatch(
              pagesListVariablesActions.setPartial({
                search: query.length ? [{ field: 'NAME', query }] : null,
              }),
            );
          }, 250);
        }}
      />
    </ToolbarContainer>
  );
};

export default Toolbar;
