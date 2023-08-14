import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import TextField from '@via-profit/ui-kit/TextField';
import { usersListVariablesActions } from '~/redux/slicers/usersList';

const selector = createSelector(
  (store: ReduxStore) => store.usersListVariables.search,
  search => ({ search }),
);

const SearchField: React.FC = () => {
  const { search } = useSelector(selector);
  const dispatch = useDispatch();
  const [searchString, setSearchString] = React.useState('');
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setSearchString(search?.[0].query || '');
  }, [search]);

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      dispatch(
        usersListVariablesActions.setPartial({
          search: searchString
            ? [
                {
                  field: 'NAME',
                  query: searchString,
                },
              ]
            : null,
        }),
      );
    }, 300);
  }, [dispatch, searchString]);

  return (
    <TextField
      type="search"
      value={searchString}
      placeholder="Search"
      onChange={event => setSearchString(event.currentTarget.value)}
    />
  );
};

export default SearchField;
